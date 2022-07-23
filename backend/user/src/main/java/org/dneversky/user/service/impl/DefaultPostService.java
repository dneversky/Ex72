package org.dneversky.user.service.impl;

import lombok.RequiredArgsConstructor;
import org.dneversky.user.entity.Post;
import org.dneversky.user.dto.PostRequest;
import org.dneversky.user.repository.PostRepository;
import org.dneversky.user.repository.UserRepository;
import org.dneversky.user.service.PostService;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DefaultPostService implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Override
    public List<Post> getAllPosts() {

        return postRepository.findAll();
    }

    @Override
    public Post getPost(Integer id) {

        return postRepository.findById(id).orElseThrow(
                () -> new org.dneversky.user.exception.EntityNotFoundException("Post with id " + id + " not found."));
    }

    @Override
    public Post savePost(PostRequest postRequest) {
        if(postRepository.existsByName(postRequest.getName())) {
            throw new EntityExistsException("Post with name " + postRequest.getName() + " already exists.");
        }

        Post post = new Post();
        post.setName(postRequest.getName());

        return postRepository.save(post);
    }

    @Override
    public Post updatePost(Integer id, PostRequest postRequest) {
        Post post = postRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Post with id " + id + " not found."));

        post.setName(postRequest.getName());

        return postRepository.save(post);
    }

    @Override
    public void deletePost(Integer id) {
        Post post = postRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Post with id " + id + " not found."));

        if(post.getUsers() != null && post.getUsers().size() > 0) {
            post.getUsers().forEach(user -> {
                user.setPost(null);
                userRepository.save(user);
            });
        }

        postRepository.delete(post);
    }

    @PostConstruct
    private void init() {
        if(!postRepository.existsByName("Default")) {
            Post post = Post.builder()
                    .name("Default")
                    .build();
            postRepository.save(post);
        }
    }
}