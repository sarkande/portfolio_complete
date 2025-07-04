import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {
  @Input() images: string[] = [];

  currentIndex = 0;

  ngOnInit() {

  }



  nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevImage() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  setCurrentImage(index: number) {
      this.currentIndex = index;
  }

 
}