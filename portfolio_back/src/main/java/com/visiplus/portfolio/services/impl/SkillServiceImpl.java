package com.visiplus.portfolio.services.impl;

import com.visiplus.portfolio.DTO.SkillWithProjects;
import com.visiplus.portfolio.models.Project;
import com.visiplus.portfolio.models.Skill;
import com.visiplus.portfolio.repository.ProjectRepository;
import com.visiplus.portfolio.repository.SkillRepository;
import com.visiplus.portfolio.services.SkillService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillServiceImpl implements SkillService {

    @Autowired
    private SkillRepository skillRepository;
    @Autowired
    private ProjectRepository projectRepository;

    public Skill findById(Integer id){
        // Find the skill by ID
        return skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
    }

    @Override
    public List<Project> findAllProjectsBySkillName(String skill_name) {
        return projectRepository.findAllBySkills_Name(skill_name);
    }

    @Override
    public Skill create(Skill skill) {
        // Check if the skill already exists
        // If it does, return the existing skill
        // If it doesn't, save the new skill and return it

        return skillRepository.findByName(skill.getName())
                .orElseGet(() -> skillRepository.save(skill));

    }

    @Override
    @Transactional
    public Skill update(Integer id, Skill skill) {
        // Find the existing skill by ID
        Skill existingSkill = skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        // Update the existing skill's properties
        existingSkill.setName(skill.getName());
        existingSkill.setLevel(skill.getLevel());
        existingSkill.setContent(skill.getContent());
        existingSkill.setIcon(skill.getIcon());

        // Save the updated skill and return it
        return skillRepository.save(existingSkill);
    }

    @Override
    public List<SkillWithProjects> findAllfindAllSkillsWithProjects() {
        return skillRepository.findAll()
                .stream()
                .map(SkillWithProjects::new)
                .collect(Collectors.toList());
    }
    @Override
    public List<Skill> findAll() {
        return skillRepository.findAll();
    }


    @Override
    public List<Skill> findAllByProjectId(Integer projectId) {
        return skillRepository.findAllByProjects_Id(projectId);
    }

    @Override
    public List<Skill> findAllByProjectSlug(String slug) {
        return skillRepository.findAllByProjects_Slug(slug);
    }

    @Override
    @Transactional
    public void delete(String name) {
        skillRepository.deleteByName(name);
    }
}
