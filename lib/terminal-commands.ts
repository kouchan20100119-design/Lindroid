export interface FileSystemNode {
  name: string;
  type: "file" | "directory";
  content?: string;
  children?: Record<string, FileSystemNode>;
}

// Simple in-memory filesystem
export const virtualFS: Record<string, FileSystemNode> = {
  home: {
    name: "home",
    type: "directory",
    children: {
      "lindroid-user": {
        name: "lindroid-user",
        type: "directory",
        children: {
          Documents: { name: "Documents", type: "directory", children: {} },
          Downloads: { name: "Downloads", type: "directory", children: {} },
          Pictures: { name: "Pictures", type: "directory", children: {} },
          Videos: { name: "Videos", type: "directory", children: {} },
          Projects: { name: "Projects", type: "directory", children: {} },
          "readme.txt": {
            name: "readme.txt",
            type: "file",
            content: "Welcome to Lindroid!\nThis is a simulated Linux environment.",
          },
          "script.sh": {
            name: "script.sh",
            type: "file",
            content: "#!/bin/bash\necho 'Hello from Lindroid!'",
          },
        },
      },
    },
  },
};

export class TerminalEmulator {
  private currentPath: string[] = ["home", "lindroid-user"];
  private env: Record<string, string> = {
    USER: "lindroid-user",
    HOME: "/home/lindroid-user",
    PATH: "/usr/local/bin:/usr/bin:/bin",
    SHELL: "/bin/bash",
  };

  getCurrentPath(): string {
    return "/" + this.currentPath.join("/");
  }

  private getNode(path: string[]): any {
    let current: any = virtualFS;
    for (const segment of path) {
      if (!current[segment]) return null;
      if (current[segment].children) {
        current = current[segment].children;
      } else {
        current = current[segment];
      }
    }
    return current;
  }

  executeCommand(input: string): string {
    const parts = input.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case "help":
        return this.helpCommand();
      case "clear":
        return "__CLEAR__";
      case "echo":
        return args.join(" ");
      case "date":
        return new Date().toString();
      case "whoami":
        return this.env.USER;
      case "pwd":
        return this.getCurrentPath();
      case "ls":
        return this.lsCommand(args);
      case "cd":
        return this.cdCommand(args);
      case "cat":
        return this.catCommand(args);
      case "mkdir":
        return this.mkdirCommand(args);
      case "touch":
        return this.touchCommand(args);
      case "rm":
        return this.rmCommand(args);
      case "uname":
        return this.unameCommand(args);
      case "env":
        return Object.entries(this.env)
          .map(([key, value]) => `${key}=${value}`)
          .join("\n");
      case "export":
        return this.exportCommand(args);
      case "history":
        return "Command history feature - use up/down arrows";
      case "":
        return "";
      default:
        return `bash: ${command}: command not found\nType 'help' for available commands.`;
    }
  }

  private helpCommand(): string {
    return `Available commands:
  help              - Show this help message
  clear             - Clear terminal screen
  echo [text]       - Echo text to output
  date              - Show current date and time
  whoami            - Display current user
  pwd               - Print working directory
  ls [path]         - List directory contents
  cd [path]         - Change directory
  cat [file]        - Display file contents
  mkdir [name]      - Create directory
  touch [file]      - Create empty file
  rm [file]         - Remove file
  uname [-a]        - Show system information
  env               - Display environment variables
  export KEY=VALUE  - Set environment variable
  history           - Show command history

Note: This is a simulated Linux environment running in-memory.`;
  }

  private lsCommand(args: string[]): string {
    const node = this.getNode(this.currentPath);
    if (!node) {
      return "ls: cannot access directory";
    }

    const entries = Object.values(node) as FileSystemNode[];
    if (entries.length === 0) {
      return "";
    }

    const dirs = entries.filter((e) => e.type === "directory").map((e) => e.name);
    const files = entries.filter((e) => e.type === "file").map((e) => e.name);

    return [...dirs, ...files].join("  ");
  }

  private cdCommand(args: string[]): string {
    if (args.length === 0) {
      this.currentPath = ["home", "lindroid-user"];
      return "";
    }

    const target = args[0];
    if (target === "..") {
      if (this.currentPath.length > 1) {
        this.currentPath.pop();
      }
      return "";
    }

    if (target === "/") {
      this.currentPath = [];
      return "";
    }

    if (target.startsWith("/")) {
      // Absolute path
      const newPath = target.split("/").filter((s) => s);
      const node = this.getNode(newPath);
      if (!node || node.type !== "directory") {
        return `cd: ${target}: No such directory`;
      }
      this.currentPath = newPath;
      return "";
    }

    // Relative path
    const currentNode = this.getNode(this.currentPath);
    if (!currentNode || !currentNode[target]) {
      return `cd: ${target}: No such directory`;
    }
    
    const targetNode = currentNode[target] as FileSystemNode;
    if (targetNode.type !== "directory") {
      return `cd: ${target}: Not a directory`;
    }
    
    this.currentPath = [...this.currentPath, target];
    return "";
  }

  private catCommand(args: string[]): string {
    if (args.length === 0) {
      return "cat: missing file operand";
    }

    const fileName = args[0];
    const node = this.getNode(this.currentPath);
    if (!node) {
      return `cat: ${fileName}: No such file`;
    }

    const file = node[fileName] as FileSystemNode;
    if (!file || file.type !== "file") {
      return `cat: ${fileName}: No such file`;
    }

    return file.content || "";
  }

  private mkdirCommand(args: string[]): string {
    if (args.length === 0) {
      return "mkdir: missing operand";
    }

    const dirName = args[0];
    const node = this.getNode(this.currentPath);
    if (!node) {
      return "mkdir: cannot create directory";
    }

    if (node[dirName]) {
      return `mkdir: cannot create directory '${dirName}': File exists`;
    }

    node[dirName] = {
      name: dirName,
      type: "directory",
      children: {},
    };

    return "";
  }

  private touchCommand(args: string[]): string {
    if (args.length === 0) {
      return "touch: missing file operand";
    }

    const fileName = args[0];
    const node = this.getNode(this.currentPath);
    if (!node) {
      return "touch: cannot create file";
    }

    if (!node[fileName]) {
      node[fileName] = {
        name: fileName,
        type: "file",
        content: "",
      };
    }

    return "";
  }

  private rmCommand(args: string[]): string {
    if (args.length === 0) {
      return "rm: missing operand";
    }

    const fileName = args[0];
    const node = this.getNode(this.currentPath);
    if (!node) {
      return `rm: cannot remove '${fileName}': No such file`;
    }

    if (!node[fileName]) {
      return `rm: cannot remove '${fileName}': No such file`;
    }

    delete node[fileName];
    return "";
  }

  private unameCommand(args: string[]): string {
    if (args.includes("-a")) {
      return "Linux lindroid 5.15.0-android aarch64 GNU/Linux";
    }
    return "Linux";
  }

  private exportCommand(args: string[]): string {
    if (args.length === 0) {
      return Object.entries(this.env)
        .map(([key, value]) => `export ${key}="${value}"`)
        .join("\n");
    }

    const assignment = args[0];
    const [key, value] = assignment.split("=");
    if (!key || !value) {
      return "export: invalid syntax";
    }

    this.env[key] = value.replace(/['"]/g, "");
    return "";
  }
}
