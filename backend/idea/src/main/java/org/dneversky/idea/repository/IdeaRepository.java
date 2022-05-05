package org.dneversky.idea.repository;

import org.dneversky.idea.agregate.Idea;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IdeaRepository extends MongoRepository<Idea, Long> {

}
