import {Component, OnInit} from '@angular/core';
import {Idea} from "../../models/Idea";
import {ActivatedRoute} from "@angular/router";
import {SharedService} from "../../shared/shared.service";
import {User} from "../../models/User";
import {Tag} from "../../models/Tag";

@Component({
  selector: 'app-ideas',
  templateUrl: './ideas.component.html',
  styleUrls: ['./ideas.component.css']
})
export class IdeasComponent implements OnInit {

  public search: string;
  public status: string = 'all';

  public reverse: boolean = false;

  public pageIndex: number = 0;
  public pageSize: number = 5;
  public pagers: number[] = [];
  public pagerSize: number = 0;

  public ideas: Idea[];
  public tags: Tag[];
  public changedTags: Tag[] = [];

  public paginatedIdeas: Idea[];
  public filteredIdeas: Idea[];

  public currentUser: User;

  public ideasLoader: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.ideas = this.activatedRoute.snapshot.data.ideas.filter((idea: Idea) => idea && idea.title);
    this.currentUser = this.activatedRoute.snapshot.data.currentUser;
    this.tags = this.activatedRoute.snapshot.data.tags;

    this.filteredIdeas = this.ideas;
    this.sort(1);
  }

  initPagination(size: number) {

    this.pagers = [];
    this.pagers.push(0);

    if(this.pageSize * size - this.filteredIdeas.length == 0)
      size = size - 1;

    this.pagerSize = size;

    if(size > 7) {

      if(this.pageIndex < 4) {
        for(let i = 1; i < 6; i++)
          this.pagers.push(i);

      } else if (this.pageIndex >= 4) {
        this.pagers.push(this.pageIndex - 2);
        this.pagers.push(this.pageIndex - 1);

        if(this.pageIndex != size)
          this.pagers.push(this.pageIndex);

        if(this.pageIndex < size - 3) {
          this.pagers.push(this.pageIndex + 1);
          this.pagers.push(this.pageIndex + 2);
        } else if (this.pageIndex >= size - 3 && this.pageIndex < size - 1) {
          this.pagers.push(this.pageIndex + 1);
          if (this.pageIndex == size - 3)
            this.pagers.push(this.pageIndex + 2);
        }
      }
      this.pagers.push(size);
    } else {
      for (let i = 1; i <= size; i++)
        this.pagers.push(i);
    }

    this.ideasLoader = false;
    this.sharedService.emitChange();
  }

  goIndex(index: number) {
    this.pageIndex = index;
    this.paginatedIdeas = [];

    this.ideasLoader = true;

    if(this.filteredIdeas.length == 0) {
      this.filteredIdeas = [];
    } else if (this.filteredIdeas.length / this.pageSize) {
      for (let i = 0; i < this.pageSize; i++)
        if(this.filteredIdeas[index * this.pageSize + i])
          this.paginatedIdeas.push(this.filteredIdeas[index * this.pageSize + i]);
    }

    this.initPagination(Math.floor(this.filteredIdeas.length / this.pageSize));
  }

  filter() {
    this.filteredIdeas = this.ideas;

    this.ideasLoader = true;

    if (this.search) {
      if (this.search.includes('#'))
        this.filteredIdeas = this.filteredIdeas.filter((idea: Idea) => idea.id.includes(this.search.slice(1)));
      else
        this.filteredIdeas = this.filteredIdeas.filter((idea: Idea) => idea.title.toLowerCase().includes(this.search.toLowerCase()));
    }

    if (this.status && this.status != 'all')
      this.filteredIdeas = this.filteredIdeas.filter((idea: Idea) => idea.status == this.status);

    if(this.changedTags && this.changedTags.length > 0) {
      this.filteredIdeas = this.filteredIdeas.filter((idea: Idea) =>
          idea.tags.find(t => this.changedTags.find(tt => tt.id == t.id)));
    }

    this.goIndex(0);
  }

  sort(value: number) {
    this.ideasLoader = true;

    switch (value) {
      case 1:
        this.filteredIdeas.sort((a: Idea, b: Idea) => {
          if(b.title.toLowerCase() < a.title.toLowerCase())
            return 1;
          else if(a.title.toLowerCase() < b.title.toLowerCase())
            return -1;
          else return 0;
        });
        break;
      case 2:
        this.filteredIdeas = this.filteredIdeas.sort((a, b) => {
          if (b.looks > a.looks)
            return 1
          else if (b.looks < a.looks)
            return -1
          else return 0
        });
        break;
      case 3:
        this.filteredIdeas = this.filteredIdeas.sort((a, b) => {
          if (b.rating > a.rating)
            return 1
          else if (b.rating < a.rating)
            return -1
          else return 0
        });
        break;
      case 4:
        this.filteredIdeas = this.filteredIdeas.sort((a, b) => {
          if (b.createdDate > a.createdDate)
            return 1
          else if (b.createdDate < a.createdDate)
            return -1
          else return 0
        });
        break;
    }

    if(this.reverse)
      this.filteredIdeas.reverse();

    this.goIndex(0);
  }

  reverseSort() {
    this.reverse = !this.reverse;
    this.filteredIdeas.reverse();
    this.goIndex(0);
  }

  setPageSize(value: number) {
    this.pageSize = value;
    this.goIndex(0);
  }

  changeTag(event: any, tag: Tag) {
    if(this.changedTags.includes(tag)) {
      this.changedTags = this.changedTags.filter(t => t != tag);
      event.target.classList.remove('accent');
    } else {
      this.changedTags.push(tag);
      event.target.classList.add('accent');
    }
    this.filter();
  }
}
