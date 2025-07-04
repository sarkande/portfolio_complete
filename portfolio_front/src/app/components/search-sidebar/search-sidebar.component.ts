import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconPipe } from '../../pipes/icon.pipe';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-search-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, IconPipe, NgxSliderModule],
  templateUrl: './search-sidebar.component.html',
  styleUrl: './search-sidebar.component.scss',
})
export class SearchSidebarComponent implements OnInit {
  @Input() tags: string[] = [];
  @Input() minYear!: number;
  @Input() maxYear!: number;

  @Output() filtersChanged = new EventEmitter<{
    searchText: string;
    tags: string[];
    showGitPublic: boolean;
    showObsolete: boolean;
    startYear: number;
    endYear: number;
  }>();

  searchText: string = '';
  selectedTags: string[] = [];
  showGitPublic: boolean = false;
  showObsolete: boolean = false;

  startYearFilter: number = 2000;
  endYearFilter: number = new Date().getFullYear();
  sliderOptions: Options = {
    floor: 2000,
    ceil: new Date().getFullYear(),
    step: 1,
  };

  ngOnInit(): void {
    this.startYearFilter = this.minYear;
    this.endYearFilter = this.maxYear;
    this.sliderOptions = {
      floor: this.minYear,
      ceil: this.maxYear,
      step: 1,
      translate: (value: number): string => `${value}`
    };
  }

  onFilterChange() {
    this.filtersChanged.emit({
      searchText: this.searchText.trim().toLowerCase(),
      tags: this.selectedTags,
      showGitPublic: this.showGitPublic,
      showObsolete: this.showObsolete,
      startYear: this.startYearFilter,
      endYear: this.endYearFilter,
    });
  }

  toggleTag(tag: string) {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter((t) => t !== tag);
    } else {
      this.selectedTags.push(tag);
    }
    this.onFilterChange();
  }

  isActive(tag: string): boolean {
    return this.selectedTags.includes(tag);
  }
}
