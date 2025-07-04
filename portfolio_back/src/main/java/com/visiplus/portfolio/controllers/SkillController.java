package com.visiplus.portfolio.controllers;

import com.visiplus.portfolio.DTO.SkillWithProjects;
import com.visiplus.portfolio.models.Project;
import com.visiplus.portfolio.models.Skill;
import com.visiplus.portfolio.services.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/skills")
public class SkillController {

    @Autowired
    SkillService skillService;

    @GetMapping
    public List<SkillWithProjects> findAllSkillWithProjects() {
        return skillService.findAllfindAllSkillsWithProjects();
    }

    @GetMapping("/last_skills")
    public List<Skill> findLastSkills() {
        return skillService.findAll().stream()
                .filter(s -> s.getLevel() == 5 || s.getLevel() == 4)
                .sorted(Comparator.comparingInt(Skill::getLevel).reversed())
                .limit(20)
                .toList();
    }
    @GetMapping("/{skill_name}/projects")
    public List<Project> findAllProjectsBySkillName(@PathVariable String skill_name) {
        return skillService.findAllProjectsBySkillName(skill_name);
    }

    @GetMapping("/projects/{projectSlug}")
    public List<Skill> findAllByProjectSlug(String projectSlug) {
        return skillService.findAllByProjectSlug(projectSlug);
    }

    @PostMapping
    public Skill create(@RequestBody Skill skill) {
        System.out.println(skill);
        return skillService.create(skill);
    }

    @PutMapping("/{id}")
    public Skill update(@PathVariable Integer id, @RequestBody Skill skill) {
        return skillService.update(id, skill);
    }

    @DeleteMapping("/{name}")
    public void delete(@PathVariable String name) {
        skillService.delete(name);
    }
}
