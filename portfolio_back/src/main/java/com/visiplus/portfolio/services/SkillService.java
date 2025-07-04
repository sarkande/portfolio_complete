package com.visiplus.portfolio.services;

import com.visiplus.portfolio.DTO.SkillWithProjects;
import com.visiplus.portfolio.models.Project;
import com.visiplus.portfolio.models.Skill;

import java.util.List;

public interface SkillService {
    Skill findById(Integer id);
    List<Project> findAllProjectsBySkillName(String skill_name);
    Skill create(Skill skill);
    Skill update(Integer id, Skill skill);
    List<SkillWithProjects> findAllfindAllSkillsWithProjects();
    List<Skill> findAllByProjectId(Integer projectId);
    List<Skill> findAllByProjectSlug(String slug);
    List<Skill> findAll();
    void delete(String name);
}
