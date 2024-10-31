                const codeEditor = document.getElementById('codeEditor');
                const preview = document.getElementById('preview');
                const fileTabs = document.getElementById('fileTabs');
                const newFileBtn = document.getElementById('newFileBtn');
                const contextMenu = document.getElementById('contextMenu');
                const renameFileBtn = document.getElementById('renameFileBtn');
                const deleteFileBtn = document.getElementById('deleteFileBtn');
                const lineNumbers = document.getElementById('lineNumbers');

                let currentFile = 'index.html'; // Start with the default HTML file
                let files = { 'index.html': '<h1>Hello, World!</h1>' }; // Initialize with a default HTML file
                let selectedFile = null; // Track the selected file for renaming/deleting

                // Function to update the preview based on the content in the editor
                function updatePreview() {
                    const htmlContent = files[currentFile] || '';
                    const cssContent = files['styles.css'] || '';
                    const jsContent = files['script.js'] || '';

                    const fullPreview = `
                        <html>
                            <head>
                                <style>${cssContent}</style>
                            </head>
                            <body>
                                ${htmlContent}
                                <script>${jsContent}<\/script>
                            </body>
                        </html>
                    `;
                    preview.srcdoc = fullPreview; // Update the preview with the complete HTML document
                }

                // Function to switch to a selected file
                function switchFile(fileName) {
                    currentFile = fileName;
                    codeEditor.value = files[currentFile] || '';
                    updateLineNumbers(); // Update line numbers whenever file is switched
                    updatePreview();

                    // Update the active tab style
                    Array.from(fileTabs.children).forEach(tab => {
                        tab.classList.remove('active');
                    });
                    document.getElementById(`tab-${fileName}`).classList.add('active');
                }

                // Function to update line numbers in the editor
                function updateLineNumbers() {
                    const lines = codeEditor.value.split('\n').length;
                    lineNumbers.innerHTML = '';
                    for (let i = 1; i <= lines; i++) {
                        lineNumbers.innerHTML += i + '<br>'; // Add line numbers
                    }
                }

                // Function to create a new file
                function createNewFile() {
                    const fileName = prompt("Enter file name:", "untitled.html");
                    if (fileName && !files[fileName]) {
                        files[fileName] = ''; // Initialize new file with empty content
                        addFileTab(fileName);
                        switchFile(fileName);
                    } else if (files[fileName]) {
                        alert("File already exists! Please choose a different name.");
                    }
                }

                // Function to add a new file tab in the sidebar
                function addFileTab(fileName) {
                    const fileTab = document.createElement('div');
                    fileTab.textContent = fileName;
                    fileTab.classList.add('file-tab');
                    fileTab.id = `tab-${fileName}`;
                    fileTab.onclick = () => switchFile(fileName);

                    // Add right-click event for context menu
                    fileTab.oncontextmenu = (event) => {
                        event.preventDefault(); // Prevent the default context menu
                        selectedFile = fileName; // Track the selected file
                        showContextMenu(event.clientX, event.clientY); // Show custom context menu
                    };

                    fileTabs.appendChild(fileTab);
                }

                // Function to show the context menu
                function showContextMenu(x, y) {
                    contextMenu.style.display = 'block';
                    contextMenu.style.left = `${x}px`;
                    contextMenu.style.top = `${y}px`;
                }

                // Function to hide the context menu
                function hideContextMenu() {
                    contextMenu.style.display = 'none';
                }

                // Event listener for the code editor input to update files and line numbers
                codeEditor.addEventListener('input', () => {
                    if (currentFile) {
                        files[currentFile] = codeEditor.value; // Update the content of the current file
                        updateLineNumbers(); // Update line numbers on input
                        updatePreview();
                    }
                });

                // Add event listener for the new file button
                newFileBtn.addEventListener('click', createNewFile);

                // Event listener for context menu actions
                renameFileBtn.addEventListener('click', () => {
                    const newName = prompt("Enter new file name:", selectedFile);
                    if (newName && !files[newName]) {
                        files[newName] = files[selectedFile]; // Copy content to new file
                        delete files[selectedFile]; // Remove old file
                        document.getElementById(`tab-${selectedFile}`).remove(); // Remove old tab
                        addFileTab(newName); // Add new tab
                        switchFile(newName); // Switch to the new file
                    } else if (files[newName]) {
                        alert("File already exists! Please choose a different name.");
                    }
                    hideContextMenu();
                });

                deleteFileBtn.addEventListener('click', () => {
                    if (confirm(`Are you sure you want to delete "${selectedFile}"?`)) {
                        delete files[selectedFile]; // Delete the selected file
                        document.getElementById(`tab-${selectedFile}`).remove(); // Remove the tab
                        currentFile = 'index.html'; // Switch back to the default file
                        switchFile(currentFile); // Switch to default file
                    }
                    hideContextMenu();
                });

                // Resizable logic for the preview
                const resizer = document.getElementById('resizer');
                let isResizing = false;

                resizer.addEventListener('mousedown', (event) => {
                    isResizing = true;
                    document.body.style.cursor = 'ns-resize';
                });

                window.addEventListener('mousemove', (event) => {
                    if (!isResizing) return;
                    const editorContainer = document.querySelector('.editor-container');
                    const editor = document.querySelector('.editor');
                    const newHeight = event.clientY - editorContainer.getBoundingClientRect().top;
                    if (newHeight > 100 && newHeight < editorContainer.clientHeight - 50) { // Prevents the height from going too low
                        editor.style.height = `${newHeight}px`;
                        preview.style.height = `calc(100% - ${newHeight}px - 5px)`; // 5px for the resizer
                    }
                });

                window.addEventListener('mouseup', () => {
                    isResizing = false;
                    document.body.style.cursor = 'default';
                });

                // Initialize with the default index.html file
                addFileTab('index.html'); // Create the tab for index.html
                switchFile('index.html'); // Switch to the default file