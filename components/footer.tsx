import { IconBrandGithub } from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="text-sm flex flex-col items-center text-muted-foreground">
      <div>
        &copy; {new Date().getFullYear()} nextstore by Arridha Amrad | Portfolio
        Project
      </div>
      <a
        className="flex items-center gap-1"
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/arridha-amrad"
      >
        <IconBrandGithub className="size-4" /> arridha-amrad
      </a>
    </footer>
  );
}
