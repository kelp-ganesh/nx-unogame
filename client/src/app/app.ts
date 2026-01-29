import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PrimeNG } from 'primeng/config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('web');
  private readonly primeng = inject(PrimeNG);
  ngOnInit() {
    this.primeng.ripple.set(true);
  }
}
