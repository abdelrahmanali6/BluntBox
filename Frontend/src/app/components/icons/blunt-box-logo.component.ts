import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blunt-box-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg 
      [attr.width]="size" 
      [attr.height]="size" 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      [class]="className"
    >
      <!-- Outer rounded square -->
      <rect 
        x="4" 
        y="4" 
        width="40" 
        height="40" 
        rx="12" 
        stroke="currentColor" 
        strokeWidth="2.5"
        fill="none"
        opacity="0.6"
      />
      <!-- Inner message bubble -->
      <path 
        d="M14 18C14 16.3431 15.3431 15 17 15H31C32.6569 15 34 16.3431 34 18V26C34 27.6569 32.6569 29 31 29H21L16 33V29H17C15.3431 29 14 27.6569 14 26V18Z" 
        fill="currentColor"
        opacity="0.8"
      />
      <!-- Dots representing anonymous message -->
      <circle cx="21" cy="22" r="1.5" fill="hsl(225, 20%, 10%)" />
      <circle cx="26" cy="22" r="1.5" fill="hsl(225, 20%, 10%)" />
    </svg>
  `
})
export class BluntBoxLogoComponent {
  @Input() size: number = 32;
  @Input() className: string = '';
}
