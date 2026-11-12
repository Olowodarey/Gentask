import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold leading-6 text-foreground">Product</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/explore" className="text-sm text-muted-foreground hover:text-primary">Explore Batches</Link></li>
              <li><Link href="/campaigns" className="text-sm text-muted-foreground hover:text-primary">Campaigns</Link></li>
              <li><Link href="/grants" className="text-sm text-muted-foreground hover:text-primary">Grants</Link></li>
              <li><Link href="/leaderboard" className="text-sm text-muted-foreground hover:text-primary">Leaderboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-foreground">Developers</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/docs" className="text-sm text-muted-foreground hover:text-primary">Documentation</Link></li>
              <li><Link href="/api" className="text-sm text-muted-foreground hover:text-primary">API Reference</Link></li>
              <li><Link href="https://github.com/genlayer" className="text-sm text-muted-foreground hover:text-primary">GitHub</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-foreground">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link></li>
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">Blog</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-foreground">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">&copy; 2026 Gentask. Powered by GenLayer. Open source under MIT license.</p>
          <div className="flex gap-4">
            <a href="https://github.com/genlayer" className="text-muted-foreground hover:text-primary" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://twitter.com/genlayer" className="text-muted-foreground hover:text-primary" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
