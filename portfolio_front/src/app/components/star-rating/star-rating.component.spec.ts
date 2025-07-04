import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StarRatingComponent } from './star-rating.component';

describe('StarRatingComponent', () => {
    let component: StarRatingComponent;
    let fixture: ComponentFixture<StarRatingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StarRatingComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StarRatingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with default priority', () => {
        expect(component.priority).toBe(1);
    });

    it('should set priority correctly when not readonly', () => {
        component.readonly = false;
        spyOn(component.priorityChange, 'emit');

        component.setPriority(3);
        expect(component.priority).toBe(4);
        expect(component.priorityChange.emit).toHaveBeenCalledWith(4);
    });

    it('should not change priority when readonly', () => {
        component.readonly = true;
        spyOn(component.priorityChange, 'emit');

        component.setPriority(3);
        expect(component.priority).toBe(1); // Default priority
        expect(component.priorityChange.emit).not.toHaveBeenCalled();
    });

    it('should set hovered index when not readonly', () => {
        component.readonly = false;
        component.setHover(2);
        expect(component.hoveredIndex).toBe(2);
    });

    it('should not set hovered index when readonly', () => {
        component.readonly = true;
        component.setHover(2);
        expect(component.hoveredIndex).toBe(-1);
    });

    it('should clear hovered index', () => {
        component.hoveredIndex = 2;
        component.clearHover();
        expect(component.hoveredIndex).toBe(-1);
    });

    it('should not exceed maximum priority', () => {
        component.readonly = false;
        component.setPriority(5);
        expect(component.priority).toBe(5);
    });

    it('should not go below minimum priority', () => {
        component.readonly = false;
        component.setPriority(-1);
        expect(component.priority).toBe(1);
    });
});
