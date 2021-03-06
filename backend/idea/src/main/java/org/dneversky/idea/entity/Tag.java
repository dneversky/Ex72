package org.dneversky.idea.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Size(max = 128, message = "Name size is: min 0 max 128")
    private String name;

    @ManyToMany(mappedBy = "tags", cascade = CascadeType.DETACH)
    private List<Idea> ideas = new ArrayList<>();

    public Tag(String name) {
        this.name = name;
    }
}
