package com.visiplus.portfolio.controllers;

import com.visiplus.portfolio.models.Project;
import com.visiplus.portfolio.models.Skill;
import com.visiplus.portfolio.repository.ProjectRepository;
import com.visiplus.portfolio.services.ProjectService;
import com.visiplus.portfolio.services.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    @Autowired
    private  ProjectService projectService;
    @Autowired
    private SkillService skillService;


    @GetMapping
    public List<Project> findAll() {
        return projectService.findAll();
    }

    @GetMapping("/last_projects")
    public List<Project> findLastProjects() {
        return projectService.findAll().stream()
                .sorted((p1, p2) -> {
                    LocalDate d1 = (p1.getEndDate() == null || p1.getEndDate().isBlank())
                            ? LocalDate.MAX
                            : LocalDate.parse(p1.getEndDate());
                    LocalDate d2 = (p2.getEndDate() == null || p2.getEndDate().isBlank())
                            ? LocalDate.MAX
                            : LocalDate.parse(p2.getEndDate());
                    return d2.compareTo(d1);
                })
                .limit(5)
                .toList();
    }
    @GetMapping("/{slug}")
    public Project findBySlug(@PathVariable String slug) {
        return projectService.findBySlug(slug);
    }

    @PostMapping
    public Project create(@RequestBody Project project) {
        return projectService.create(project);
    }

    @PutMapping("/{slug}")
    public ResponseEntity<Project> update(@PathVariable String slug, @RequestBody Project updated) {
        Project result = projectService.update(slug, updated);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<Void> delete(@PathVariable String slug) {
       // check if the project exist
        if (projectService.findBySlug(slug) != null) {
            projectService.delete(slug);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{slug}/skills/{skillId}")
    public boolean addSkill(@PathVariable String slug, @PathVariable Integer skillId) {
        // Check if the skill exists
        Skill skill = skillService.findById(skillId);
        return projectService.addSkill(slug, skill) != null;
    }

    @DeleteMapping("/{slug}/skills/{skillId}")
    public boolean removeSkill(@PathVariable String slug, @PathVariable Integer skillId) {
        // Check if the skill exists
        Skill skill = skillService.findById(skillId);
        return projectService.removeSkill(slug, skill.getId()) != null;
    }
}
