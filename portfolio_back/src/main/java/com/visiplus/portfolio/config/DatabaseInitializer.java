package com.visiplus.portfolio.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.visiplus.portfolio.models.Project;
import com.visiplus.portfolio.models.Skill;
import com.visiplus.portfolio.models.User;
import com.visiplus.portfolio.repository.ProjectRepository;
import com.visiplus.portfolio.repository.SkillRepository;
import com.visiplus.portfolio.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.InputStream;
import java.text.Normalizer;
import java.util.*;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {
        createAdminUser();
        loadSkillsFromJson();
        loadProjectsFromJson();
    }

    private void createAdminUser() {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin"))
                    .build();
            userRepository.save(admin);
            System.out.println("✅ Admin user created: admin / admin");
        }
    }

    private void loadSkillsFromJson() throws Exception {
        if (skillRepository.count() > 0) {
            System.out.println("ℹ️ Skills already initialized, skipping skills.json load.");
            return;
        }

        ClassPathResource skillsResource = new ClassPathResource("skills.json");
        try (InputStream is = skillsResource.getInputStream()) {
            List<Skill> skillsFromFile = objectMapper.readValue(
                is, new TypeReference<List<Skill>>() {}
            );

            skillsFromFile.forEach(skillDef -> {
                skillRepository.findByName(skillDef.getName())
                    .map(existing -> {
                        // met à jour le niveau, description, icône…
                        existing.setLevel(skillDef.getLevel());
                        existing.setContent(skillDef.getContent());
                        existing.setIcon(skillDef.getIcon());
                        return skillRepository.save(existing);
                    })
                    .orElseGet(() -> skillRepository.save(skillDef));
            });

            System.out.println("✅ Loaded " + skillsFromFile.size() + " skills from skills.json");
        }
    }

    private void loadProjectsFromJson() throws Exception {
        if (projectRepository.count() > 0) {
            System.out.println("ℹ️ Projects already initialized, skipping projects.json load.");
            return;
        }

        // Pré-chargement de toutes les compétences en base, indexées par nom
        Map<String, Skill> skillIndex = skillRepository.findAll()
            .stream()
            .collect(Collectors.toMap(Skill::getName, s -> s));

        ClassPathResource projectsResource = new ClassPathResource("projects.json");
        try (InputStream is = projectsResource.getInputStream()) {
            List<Project> projects = objectMapper.readValue(
                is, new TypeReference<List<Project>>() {}
            );

            projects.forEach(project -> {
                // génération de slug unique
                if (project.getSlug() == null || project.getSlug().isEmpty()) {
                    project.setSlug(generateUniqueSlug(project.getTitle()));
                }

                // mapping technologies → entités Skill déjà en base
                Set<Skill> linkedSkills = project.getTechnologies().stream()
                    .map(name -> skillIndex.computeIfAbsent(name, missingName -> {
                        // en cas d’absence, crée une compétence par défaut
                        Skill s = new Skill();
                        s.setName(missingName);
                        s.setLevel(1);
                        Skill saved = skillRepository.save(s);
                        skillIndex.put(missingName, saved);
                        return saved;
                    }))
                    .collect(Collectors.toSet());

                project.setSkills(linkedSkills);
            });

            projectRepository.saveAll(projects);
            System.out.println("✅ Loaded " + projects.size() + " projects into database.");
        }
    }

    private String generateUniqueSlug(String title) {
        String baseSlug = toSlug(title);
        String slug = baseSlug;
        int counter = 1;
        while (projectRepository.findBySlug(slug).isPresent()) {
            slug = baseSlug + "-" + counter++;
        }
        return slug;
    }

    private String toSlug(String input) {
        String base;
        if (input != null && input.trim().startsWith("{") && input.contains("\"fr\"")) {
            try {
                JSONObject json = new JSONObject(input);
                base = json.optString("fr", input);
            } catch (Exception e) {
                base = input;
            }
        } else {
            base = input;
        }
        String normalized = Normalizer.normalize(base, Normalizer.Form.NFD)
            .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        return normalized.toLowerCase()
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("(^-|-$)", "");
    }
}