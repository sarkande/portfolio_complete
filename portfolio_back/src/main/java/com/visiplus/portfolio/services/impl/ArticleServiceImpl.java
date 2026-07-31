package com.visiplus.portfolio.services.impl;

import com.visiplus.portfolio.exceptions.ArticleNotFoundException;
import com.visiplus.portfolio.models.Article;
import com.visiplus.portfolio.repository.ArticleRepository;
import com.visiplus.portfolio.services.ArticleService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository articleRepository;

    @Override
    public List<Article> findAllActive() {
        return articleRepository.findAllByActiveTrue();
    }

    @Override
    public List<Article> findAll() {
        return articleRepository.findAll();
    }

    @Override
    @Transactional
    public Article create(Article article) {
        article.setSlug(generateUniqueSlug(article.getTitle()));
        return articleRepository.save(article);
    }

    @Override
    @Transactional
    public Article update(String slug, Article updated) {
        Article existing = articleRepository.findBySlug(slug)
                .orElseThrow(() -> new ArticleNotFoundException(slug));

        if (!existing.getTitle().equals(updated.getTitle())) {
            updated.setSlug(generateUniqueSlug(updated.getTitle()));
        } else {
            updated.setSlug(existing.getSlug());
        }

        updated.setId(existing.getId());
        return articleRepository.save(updated);
    }

    @Override
    public Article findBySlug(String slug) {
        return articleRepository.findBySlug(slug)
                .orElseThrow(() -> new ArticleNotFoundException(slug));
    }

    @Override
    public void delete(String slug) {
        Article article = articleRepository.findBySlug(slug)
                .orElseThrow(() -> new ArticleNotFoundException(slug));
        articleRepository.delete(article);
    }

    private String generateUniqueSlug(String title) {
        String baseSlug = toSlug(title);
        String slug = baseSlug;
        int counter = 1;
        while (articleRepository.findBySlug(slug).isPresent()) {
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
