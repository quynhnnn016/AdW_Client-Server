import { Component, signal } from '@angular/core';
import { Test } from './test/test';

@Component({
  selector: 'app-root',
  imports: [Test],
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('my-client');
}
