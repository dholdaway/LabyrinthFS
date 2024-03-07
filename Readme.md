# LabyrinthFS - Git LFS Viewer and Manager

LabyrinthFS is a desktop application designed to provide an intuitive interface for managing Git Large File Storage (LFS) objects within your repositories. It helps users visualize LFS-tracked files, see which branches they belong to, and manage disk space by identifying and cleaning up old or unused LFS objects.

## Features

- **Repository Browsing**: Easily browse and select local Git repositories to examine.
- **LFS Files Visualization**: View a list of all LFS-tracked files within a selected repository, complete with file sizes.
- **Branch Information**: Determine which branches contain the LFS-tracked files.
- **Disk Space Management**: Perform dry runs and execute cleanups of old or unused LFS objects to conserve disk space.

## Getting Started

### Prerequisites

- Git and Git LFS installed on your system.
- Node.js and npm (Node Package Manager) to run and build the application.

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/dholdaway/LabyrinthFS.git
cd LabyrinthFS
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the application**

```bash
npm start
```

## Usage

1. **Open LabyrinthFS**: Launch the application through your terminal or command prompt with `npm start`.
2. **Select a Repository**: Use the "Browse" button to select a local Git repository where Git LFS is initialized.
3. **View LFS Files**: Click the "Show LFS Files" button to display the LFS-tracked files along with their sizes.
4. **Manage Disk Space**:
   - Perform a **Dry Run Cleanup** to simulate the cleanup process without actually deleting any files. This will show you what would be removed.
   - Execute **Cleanup** to remove old or unused LFS objects, freeing up disk space.

## Contributing

We welcome contributions to LabyrinthFS! If you have suggestions for improvements or bug reports, please open an issue. Pull requests are also appreciated. See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## License

LabyrinthFS is open-source software licensed under the [MIT License](LICENSE).

## Acknowledgments

- Thank you to all the contributors who have helped to make LabyrinthFS better.
- Special thanks to the Git and Git LFS teams for making version control with large files easier.
