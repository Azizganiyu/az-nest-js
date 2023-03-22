import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { HelperService } from './services/helper/helper.service';

@Injectable()
export class AppService {
  constructor(
    private helperService: HelperService,
    private connection: Connection,
  ) {}
  async getHello() {
    return `
      <style>
      body {
        background: rgb(26, 44, 206);
        color: #fff;
        height: 100vh;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      span {
        position: relative;
        font-family: "Avenir Next", sans-serif;
        font-weight: 900;
        font-size: 64px;
        text-transform: uppercase;
        font-style: italic;
        letter-spacing: 0.05em;
        display: inline-block;
      }
      span:before {
        position: absolute;
        left: 0;
        top: 0;
        content: attr(filter-content);
      
        filter: url(#motion-blur-filter);
      }
      svg {
        display: none;
      }
      </style>
      <svg xmlns="http://www.w3.org/2000/svg">
    
    <!-- filterUnits is required to prevent clipping the blur outside the viewBox -->
    
      <filter id="motion-blur-filter" filterUnits="userSpaceOnUse">
        
        <!-- We only want horizontal blurring. x: 100, y: 0 -->
        
          <feGaussianBlur stdDeviation="100 0"></feGaussianBlur>
      </filter>
  </svg>

  <!-- We use a custom attribute to set the text that the pseudo element should display and blur. In this case, we use the first character of the word. -->

  <span filter-content="S">DEV TEST</span>
    
    `;
  }
}
