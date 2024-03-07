const { ipcRenderer } = require('electron');
const { exec } = require('child_process');

function openDialog() {
    ipcRenderer.send('open-dialog');
}

ipcRenderer.on('selected-directory', (event, path) => {
    document.getElementById('repoPath').value = path;
});

function execGitCommand(command, repoPath) {
    return new Promise((resolve, reject) => {
        exec(command, { cwd: repoPath }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command '${command}': ${error}`);
                return reject(stderr);
            }
            resolve(stdout.trim());
        });
    });
}

async function findBranchesForFile(filePath, repoPath) {
    try {
        const commitCommand = `git log --pretty=format:'%H' -- "${filePath}"`;
        const commitHashes = await execGitCommand(commitCommand, repoPath);
        if (!commitHashes) {
            console.log(`No commits found for file ${filePath}`);
            return [];
        }

        const branchesSet = new Set();
        for (let commitHash of commitHashes.split('\n')) {
            const branchesCommand = `git branch --contains ${commitHash}`;
            const branches = await execGitCommand(branchesCommand, repoPath);
            branches.split('\n').map(branch => branchesSet.add(branch.trim()));
        }
        return Array.from(branchesSet);
    } catch (error) {
        console.error(`Error finding branches for file '${filePath}': ${error}`);
        return [];
    }
}

async function displayLfsFilesWithBranchPresence(repoPath) {
    const filesContainer = document.getElementById('lfs-files');
    filesContainer.innerHTML = '';

    try {
        const lfsFilesOutput = await execGitCommand('git lfs ls-files -a -s', repoPath);
        const files = lfsFilesOutput.split('\n');

        for (let file of files) {
            if (!file) continue;
            const [oid, size, filePath] = file.split(/\s+/);
            const branches = await findBranchesForFile(filePath, repoPath);
            const fileItem = document.createElement('li');
            fileItem.textContent = `${filePath} (Size: ${formatBytes(parseInt(size, 10))}) - Branches: ${branches.join(', ') || 'No branch information'}`;
            filesContainer.appendChild(fileItem);
        }
    } catch (error) {
        console.error("Error displaying LFS files:", error);
    }
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function onShowLfsFilesClick() {
    const repoPath = document.getElementById('repoPath').value;
    if (!repoPath) {
        alert('Please enter a valid repository path.');
        return;
    }
    displayLfsFilesWithBranchPresence(repoPath);
}

// Modify the pruneLfsObjects function signature to accept only the isDryRun parameter
async function pruneLfsObjects(isDryRun) {
  const repoPath = document.getElementById('repoPath').value; // Dynamically get the repoPath
  if (!repoPath) {
      alert('Please enter a valid repository path.');
      return;
  }
  
  try {
      let pruneCommand = 'git lfs prune --verify-remote';
      if (isDryRun) {
          pruneCommand += ' --dry-run';
      }
      
      const result = await execGitCommand(pruneCommand, repoPath);
      console.log(result); // Outputs the result of the prune operation
      
      // Display feedback based on the dry run or actual execution
      alert(`Cleanup process ${(isDryRun ? 'simulation' : 'execution')} completed. Check console for details.`);
  } catch (error) {
      console.error("Error pruning LFS objects:", error);
      alert("Error during cleanup process. Check console for details.");
  }
}

