package com.visiplus.portfolio.services;

import com.visiplus.portfolio.models.Project;
import com.visiplus.portfolio.models.Skill;

import java.util.List;

public interface ProjectService {
    List<Project> findAll();
    Project create(Project project);
    Project update(String id, Project project);
    Project findBySlug(String slug);
    void delete(String id);

    Project addSkill(String slug, Skill skill);
    Project removeSkill(String slug, Integer skillId);
}