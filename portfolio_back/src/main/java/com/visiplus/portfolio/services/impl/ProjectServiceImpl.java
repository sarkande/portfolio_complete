package com.visiplus.portfolio.services.impl;

import com.visiplus.portfolio.exceptions.ProjectNotFoundException;
import com.visiplus.portfolio.models.Project;
import com.visiplus.portfolio.models.Skill;
import com.visiplus.portfolio.repository.ProjectRepository;
import com.visiplus.portfolio.repository.SkillRepository;
import com.visiplus.portfolio.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final SkillRepository   skillRepository;


    @Override
    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    @Override
    @Transactional
    public Project create(Project project) {
        // 1️⃣ Génération du slug
        String uniqueSlug = generateUniqueSlug(project.getTitle());
        project.setSlug(uniqueSlug);

        // 2️⃣ Traitement des skills inbound
        Set<Skill> linkedSkills = project.getSkills().stream()
                .map(incoming ->
                        skillRepository.findByName(incoming.getName())
                                .map(existing -> {
                                    existing.setLevel(incoming.getLevel());
                                    return existing;
                                })
                                .orElseGet(() -> {
                                    Skill s = new Skill();
                                    s.setName(incoming.getName());
                                    s.setLevel(incoming.getLevel());
                                    return s;
                                })
                )
                .collect(Collectors.toSet());
        project.setSkills(linkedSkills);

        // 3️⃣ Persistence
        return projectRepository.save(project);
    }

    @Override
    @Transactional
    public Project update(String slug, Project updated) {
        // 1️⃣ Récupération de l’existant
        Project existing = projectRepository.findBySlug(slug)
                .orElseThrow(ProjectNotFoundException::new);

        // 2️⃣ Slug : garde l'ancien si le titre n’a pas changé
        if (!existing.getTitle().equals(updated.getTitle())) {
            updated.setSlug(generateUniqueSlug(updated.getTitle()));
        } else {
            updated.setSlug(existing.getSlug());
        }

        updated.setId(existing.getId());

        // 3️⃣ Traitement des skills inbound (même logique que create)
        Set<Skill> linkedSkills = updated.getSkills().stream()
                .map(incoming ->
                        skillRepository.findByName(incoming.getName())
                                .map(ex -> {
                                    ex.setLevel(incoming.getLevel());
                                    return ex;
                                })
                                .orElseGet(() -> {
                                    Skill s = new Skill();
                                    s.setName(incoming.getName());
                                    s.setLevel(incoming.getLevel());
                                    return s;
                                })
                )
                .collect(Collectors.toSet());
        updated.setSkills(linkedSkills);

        // 4️⃣ Sauvegarde du projet mis à jour
        return projectRepository.save(updated);
    }

    @Override
    public Project findBySlug(String slug) {
        return projectRepository.findBySlug(slug)
                .orElseThrow(ProjectNotFoundException::new);
    }

    @Override
    public void delete(String slug) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(ProjectNotFoundException::new);
        projectRepository.delete(project);
    }


    @Override
    @Transactional
    public Project addSkill(String slug, Skill incoming) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new ProjectNotFoundException(slug));

        // Find or create the skill
        Skill skill = skillRepository.findByName(incoming.getName())
                .map(existing -> {
                    existing.setLevel(incoming.getLevel());
                    return existing;
                })
                .orElseGet(() -> skillRepository.save(incoming));

        project.getSkills().add(skill);
        return projectRepository.save(project);
    }

    @Override
    @Transactional
    public Project removeSkill(String slug, Integer skillId) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new ProjectNotFoundException(slug));

        project.getSkills().removeIf(s -> s.getId().equals(skillId));
        return projectRepository.save(project);
    }

    // —————————————————————————————————————————————
    // Méthodes de slugification (inchangées)
    // —————————————————————————————————————————————

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
        String noAccents = Normalizer.normalize(base, Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]+", "");
        return noAccents.toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
    }
}
