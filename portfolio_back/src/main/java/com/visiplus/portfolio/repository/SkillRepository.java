package com.visiplus.portfolio.repository;

import com.visiplus.portfolio.models.Project;
import com.visiplus.portfolio.models.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Integer> {
    Optional<Skill> findByName(String name);
    /**
     * Récupère toutes les compétences liées
     * à un projet d'ID donné
     */
    List<Skill> findAllByProjects_Id(Integer projectId);

    /**
     * Récupère toutes les compétences liées
     * à un projet identifié par son slug
     */
    List<Skill> findAllByProjects_Slug(String slug);
    /**
     * Supprime une compétence par son nom
     */
    void deleteByName(String name);


}