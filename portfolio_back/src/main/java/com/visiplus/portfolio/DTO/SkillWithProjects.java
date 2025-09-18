package com.visiplus.portfolio.DTO;

import com.visiplus.portfolio.models.Skill;

import java.util.List;


public record SkillWithProjects(
        Integer id,
        String name,
        String content,
        String longDescription,
        String description,
        Boolean isTechnical,
        Integer level,
        String icon,
        List<ProjectInfo> projects
) {
    public SkillWithProjects(Skill skill) {
        this(
                skill.getId(),
                skill.getName(),
                skill.getContent(),
                skill.getLongDescription(),
                skill.getDescription(),
                skill.getIsTechnical(),
                skill.getLevel(),
                skill.getIcon(),
                skill.getProjects().stream()
                        .map(p -> new ProjectInfo(p.getSlug(), p.getTitle()))
                        .toList()
        );
    }

    public record ProjectInfo(
            String slug,
            String title
    ) {}
}