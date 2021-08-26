package org.dneversky.idea.api;

import org.dneversky.idea.entity.Idea;
import org.dneversky.idea.entity.User;
import org.dneversky.idea.service.IdeaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@RequestMapping("ideas")
@RestController
public class IdeaController {

    private final IdeaService ideaService;

    public IdeaController(IdeaService ideaService) {
        this.ideaService = ideaService;
    }

    @GetMapping
    public ResponseEntity<List<Idea>> getAll() {

        return new ResponseEntity<>(ideaService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Idea> get(@PathVariable int id) {

        return new ResponseEntity<>(ideaService.get(id), HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Idea> add(@RequestParam String title, @RequestParam String text,
                                    @RequestParam(required = false) Set<String> tags,
                                    @RequestParam(required = false) List<MultipartFile> images,
                                    @RequestParam(required = false) List<MultipartFile> files) {

        return new ResponseEntity<>(ideaService.add(title, text, tags, images, files, new User()), HttpStatus.CREATED);
    }

    @PutMapping("/put/{idea}")
    public ResponseEntity<Idea> put(@PathVariable Idea idea, @RequestParam String title,
                                         @RequestParam String text, @RequestParam(required = false) Set<String> tags,
                                         @RequestParam(required = false) List<MultipartFile> addImages,
                                         @RequestParam(required = false) List<String> removeImages,
                                         @RequestParam(required = false) List<MultipartFile> addFiles,
                                         @RequestParam(required = false) List<String> removeFiles) {

        return new ResponseEntity<>(ideaService.put(idea, title, text, tags, addImages, removeImages, addFiles, removeFiles), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{idea}")
    public ResponseEntity<Idea> delete(@PathVariable Idea idea) {
        ideaService.delete(idea);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}