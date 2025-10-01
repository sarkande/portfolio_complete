import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-star-rating',
    standalone: true,
    imports: [CommonModule, TranslateModule],
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
    getLabel(priority: number): string {
        switch (priority) {
            case 1:
                return 'rating.very_low';
            case 2:
                return 'rating.low';
            case 3:
                return 'rating.medium';
            case 4:
                return 'rating.high';
            case 5:
                return 'rating.very_high';
            default:
                return '';
        }
    }
}
