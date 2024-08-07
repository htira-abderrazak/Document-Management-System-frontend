import { Component, ElementRef, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage';
import * as d3 from 'd3';

@Component({
  selector: 'app-storage',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css',
})
export class StorageComponent {
  size: any; // the percentge of the used size
  used_storage: any;
  availbe_storage: any;

  constructor(private el: ElementRef, private local: LocalStorageService) {}
  ngOnInit(): void {
    const size = this.local.get('total-size');
    const max_size = this.local.get('max-size');
    this.used_storage = size;
    this.availbe_storage = max_size;
    this.size = (size / max_size) * 100;
    this.changeArcDemension();
  }
  @HostListener('window:resize', [])
  changeArcDemension() {
    if (window.innerWidth <= 896) {
      this.createArcIndicator(100, 50);
    } else {
      this.createArcIndicator(200, 100);
    }
  }
  createArcIndicator(arcwidth: any, archeight: any): void {
    // Clear any existing SVG elements
    d3.select(this.el.nativeElement)
      .select('#arcContainer')
      .selectAll('svg')
      .remove();
    const percentageOfArcUsed = (this.size / 100) * 0.5;
    const outerRadius = arcwidth;
    const innerRadius = archeight;
    const width = 2 * outerRadius + 2;
    const height = outerRadius;

    const svg = d3
      .select(this.el.nativeElement)
      .select('#arcContainer')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${outerRadius}, ${outerRadius})`);

    // Arc of used size
    const arc5: any = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(-Math.PI / 2)
      .endAngle(-Math.PI / 2 + Math.PI * 2 * percentageOfArcUsed); // % of the cercle used

    // Arc for unused size
    const arc95: any = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(-Math.PI / 2 + Math.PI * 2 * percentageOfArcUsed)
      .endAngle(Math.PI / 2); // Remaining % of the circle

    svg.append('path').attr('d', arc5).attr('fill', 'steelblue');

    svg.append('path').attr('d', arc95).attr('fill', 'lightgray');
  }
}
