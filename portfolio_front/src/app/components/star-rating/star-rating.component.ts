import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-star-rating',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './star-rating.component.html',
    styleUrls: ['./star-rating.component.scss'],
})
export class StarRatingComponent {
    @Input() priority: number = 1;
    @Input() readonly: boolean = false;
    @Output() priorityChange = new EventEmitter<number>();
    stars: number[] = [1, 2, 3, 4, 5];
    hoveredIndex: number = -1;

    setPriority(newPriority: number): void {
        if (this.readonly) return;
        this.priority = newPriority + 1;
        if (this.priority <= 1) {
            this.priority = 1;
        }
        if (this.priority >= this.stars.length) {
            this.priority = this.stars.length;
        }

        this.priorityChange.emit(this.priority);
    }

    setHover(index: number): void {
        if (!this.readonly) this.hoveredIndex = index;
    }

    clearHover(): void {
        this.hoveredIndex = -1;
    }
}
