import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="logo-container">
          <img src="assets/insurance-logo.png" alt="Insurance Logo" class="logo">
          <h1>InsureHub</h1>
        </div>
        <nav class="main-nav">
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/policies/new" routerLinkActive="active">New Policy</a>
        </nav>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="app-footer">
        <p>&copy; 2024 InsureHub. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logo {
      height: 40px;
      width: auto;
    }

    .main-nav {
      display: flex;
      gap: 2rem;
    }

    .main-nav a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .main-nav a:hover {
      background-color: rgba(255,255,255,0.1);
    }

    .main-nav a.active {
      background-color: rgba(255,255,255,0.2);
    }

    .main-content {
      flex: 1;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    .app-footer {
      background-color: #f5f5f5;
      padding: 1rem;
      text-align: center;
      margin-top: auto;
    }
  `],
  standalone: true,
  imports: [RouterModule]
})
export class AppComponent {
  title = 'InsureHub';
}

