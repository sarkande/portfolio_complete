package com.visiplus.portfolio.controllers;

import com.visiplus.portfolio.models.Article;
import com.visiplus.portfolio.services.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping
    public List<Article> findAllActive() {
        return articleService.findAllActive();
    }

    @GetMapping("/{slug}")
    public Article findBySlug(@PathVariable String slug) {
        return articleService.findBySlug(slug);
    }

    @PostMapping
    public Article create(@RequestBody Article article) {
        return articleService.create(article);
    }

    @PutMapping("/{slug}")
    public ResponseEntity<Article> update(@PathVariable String slug, @RequestBody Article updated) {
        Article result = articleService.update(slug, updated);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<Void> delete(@PathVariable String slug) {
        articleService.delete(slug);
        return ResponseEntity.noContent().build();
    }
}
