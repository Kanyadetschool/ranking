/**
 * Advanced Student Missing Data Reporter
 * Enhanced with search, pagination, and powerful editing features
 */


// // Target all search inputs and select text on focus
// document.addEventListener('DOMContentLoaded', () => {
//     // Select all input elements with type="search" or specific search-related attributes
//     const searchInputs = document.querySelectorAll('input[type="search"], input[id*="search"], input[class*="search"]');
    
//     searchInputs.forEach(input => {
//         input.addEventListener('focus', function() {
//             this.select();
//         });
//     });
// });







// Global variables for Firebase imports and application state
let firebaseImports;
let studentsData = [];
let db;
let auth;
let editingCells = new Map();
let pendingUpdates = new Map();

// Pagination and search state
let currentPage = 1;
let itemsPerPage = 10;
let filteredAndSearchedStudents = [];
let searchQuery = '';

// --- Firebase Configuration ---
const appId = 'default-app-id'; 
const sanitizedAppId = appId.replace(/\./g, '_');
const customFirebaseConfig = {
    apiKey: "AIzaSyA_41WpdMjHJOU5s3gQ9aieIayZRvUoRLE",
    authDomain: "kanyadet-school-admin.firebaseapp.com",
    projectId: "kanyadet-school-admin",
    databaseURL: "https://kanyadet-school-admin-default-rtdb.firebaseio.com",
    storageBucket: "kanyadet-school-admin.firebasestorage.app",
    messagingSenderId: "409708360032",
    appId: "1:409708360032:web:a21d63e8cb5fa1ecabee05",
    measurementId: "G-Y4C0ZRRL52"
};

// --- DOM Elements ---
const gradeFilter = document.getElementById('grade-filter');
const fieldFilter = document.getElementById('field-filter');
const searchInput = document.getElementById('search-input');
const itemsPerPageSelect = document.getElementById('items-per-page');
const tableBody = document.querySelector('#missing-data-table tbody');
const missingFieldHeader = document.getElementById('missing-field-header');
const reportSummary = document.getElementById('report-summary');
const paginationInfo = document.getElementById('pagination-info');
const paginationControls = document.getElementById('pagination-controls');
const loader = document.getElementById('loader');
const signInBtn = document.getElementById('google-sign-in-btn');
const signOutBtn = document.getElementById('sign-out-btn');
const userInfo = document.getElementById('user-info');
const controlsDiv = document.querySelector('.controls');
const printAreaDiv = document.getElementById('print-area');




// Replace around line 153 with this complete solution:
searchInput.addEventListener('input', handleSearch);

// Auto-clear on focus for all inputs (including dynamically created ones)
document.addEventListener('focus', function(e) {
    // Target all text-type inputs
    if (e.target.tagName === 'INPUT' && 
        (e.target.type === 'text' || e.target.type === 'search')) {
        if (e.target.value) {
            e.target.value = '';
            e.target.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
}, true);



// --- Enhanced Notification System ---
const NotificationManager = {
    container: null,
    
    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            `;
            document.body.appendChild(this.container);
        }
    },
    
    show(message, type = 'success', duration = 4000) {
        this.init();
        
        const notification = document.createElement('div');
        const id = `notif-${Date.now()}`;
        notification.id = id;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        const colors = {
            success: { bg: '#27ae60', border: '#229954', shadow: 'rgba(39, 174, 96, 0.3)' },
            error: { bg: '#e74c3c', border: '#c0392b', shadow: 'rgba(231, 76, 60, 0.3)' },
            warning: { bg: '#f39c12', border: '#d68910', shadow: 'rgba(243, 156, 18, 0.3)' },
            info: { bg: '#3498db', border: '#2980b9', shadow: 'rgba(52, 152, 219, 0.3)' }
        };
        
        const color = colors[type] || colors.info;
        
        notification.style.cssText = `
            background: linear-gradient(135deg, ${color.bg} 0%, ${color.border} 100%);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            margin-bottom: 12px;
            box-shadow: 0 8px 24px ${color.shadow};
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            border-left: 4px solid ${color.border};
            backdrop-filter: blur(10px);
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="
                font-size: 24px;
                font-weight: bold;
                min-width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
            ">${icons[type]}</div>
            <div style="flex: 1; font-size: 14px; line-height: 1.5;">${message}</div>
            <div style="
                font-size: 20px;
                opacity: 0.7;
                cursor: pointer;
                padding: 0 4px;
            " onclick="this.parentElement.remove()">×</div>
        `;
        
        notification.onmouseenter = () => {
            notification.style.transform = 'translateX(-4px)';
            notification.style.boxShadow = `0 12px 32px ${color.shadow}`;
        };
        notification.onmouseleave = () => {
            notification.style.transform = 'translateX(0)';
            notification.style.boxShadow = `0 8px 24px ${color.shadow}`;
        };
        
        this.container.insertBefore(notification, this.container.firstChild);
        
        if (duration > 0) {
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.4s ease-in-out';
                setTimeout(() => notification.remove(), 400);
            }, duration);
        }
        
        return id;
    },
    
    success(message, duration) {
        return this.show(message, 'success', duration);
    },
    
    error(message, duration) {
        return this.show(message, 'error', duration);
    },
    
    warning(message, duration) {
        return this.show(message, 'warning', duration);
    },
    
    info(message, duration) {
        return this.show(message, 'info', duration);
    }
};

// Add animation styles
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
        }
    `;
    document.head.appendChild(style);
}

// --- Main Application Flow ---

document.addEventListener('DOMContentLoaded', () => {
    firebaseImports = window.firebaseImports;
    if (firebaseImports) {
        initializeAppAndSetListeners();
    } else {
        userInfo.textContent = "Error: Firebase modules failed to load.";
        loader.style.display = 'none';
        NotificationManager.error('Failed to initialize Firebase modules');
    }
});

function initializeAppAndSetListeners() {
    const { initializeApp, getDatabase, getAuth, onAuthStateChanged } = firebaseImports;
    try {
        const app = initializeApp(customFirebaseConfig);
        db = getDatabase(app);
        auth = getAuth(app);
        
        controlsDiv.style.display = 'none';
        printAreaDiv.style.display = 'none';
        reportSummary.textContent = 'Please sign in to load the data.';

        onAuthStateChanged(auth, (user) => {
            if (user) {
                handleSignIn(user);
            } else {
                handleSignOut();
            }
        });

        gradeFilter.addEventListener('change', () => {
            currentPage = 1;
            applyFilters();
        });
        fieldFilter.addEventListener('change', () => {
            currentPage = 1;
            applyFilters();
        });
        searchInput.addEventListener('input', handleSearch);
        itemsPerPageSelect.addEventListener('change', handleItemsPerPageChange);
        signInBtn.addEventListener('click', signInWithGoogle);
        signOutBtn.addEventListener('click', signOutUser);

    } catch (e) {
        console.error("Firebase Initialization Error:", e);
        userInfo.textContent = `Error initializing Firebase: ${e.message}`;
        loader.style.display = 'none';
        NotificationManager.error(`Firebase initialization failed: ${e.message}`);
    }
}

// --- Authentication Functions ---

async function signInWithGoogle() {
    const { GoogleAuthProvider, signInWithPopup } = firebaseImports;
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        NotificationManager.success('Successfully signed in! Welcome aboard.');
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        userInfo.textContent = `Sign-in failed: ${error.message}`;
        NotificationManager.error(`Sign-in failed: ${error.message}`);
    }
}

async function signOutUser() {
    const { signOut } = firebaseImports;
    try {
        await signOut(auth);
        NotificationManager.info('Signed out successfully. See you next time!');
    } catch (error) {
        console.error("Sign-Out Error:", error);
        NotificationManager.error('Sign-out failed. Please try again.');
    }
}

function handleSignIn(user) {
    userInfo.textContent = `Welcome, ${user.displayName || user.email}!`;
    signInBtn.style.display = 'none';
    signOutBtn.style.display = 'inline-block';
    controlsDiv.style.display = 'flex';
    printAreaDiv.style.display = 'block';
    
    fetchStudentsData();
}

function handleSignOut() {
    userInfo.textContent = "Please sign in to view the student data.";
    signInBtn.style.display = 'inline-block';
    signOutBtn.style.display = 'none';
    loader.style.display = 'none'; 
    
    studentsData = [];
    filteredAndSearchedStudents = [];
    searchQuery = '';
    currentPage = 1;
    searchInput.value = '';
    tableBody.innerHTML = '';
    reportSummary.textContent = 'Please sign in to load the data.';
    paginationInfo.textContent = '';
    paginationControls.innerHTML = '';
    controlsDiv.style.display = 'none';
    printAreaDiv.style.display = 'none';
}

// --- Search and Pagination Handlers ---

function handleSearch() {
    searchQuery = searchInput.value.toLowerCase().trim();
    currentPage = 1;
    applyFilters();
    
    if (searchQuery) {
        NotificationManager.info(`Searching for: "${searchQuery}"`, 2000);
    }
}

function handleItemsPerPageChange() {
    itemsPerPage = parseInt(itemsPerPageSelect.value);
    currentPage = 1;
    renderCurrentPage();
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredAndSearchedStudents.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderCurrentPage();
    
    // Smooth scroll to top of table
    document.querySelector('#missing-data-table').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// --- Data Fetching and Filtering Functions ---

function fetchStudentsData() {
    loader.style.display = 'flex'; 

    const { ref, onValue } = firebaseImports;
    const studentsRef = ref(db, `Results/${sanitizedAppId}/students`);
    
    onValue(studentsRef, (snapshot) => {
        const students = [];
        const data = snapshot.val();
        
        if (data) {
            for (let key in data) {
                students.push({ id: key, ...data[key] }); 
            }
        }
        
        students.sort((a, b) => {
            const assessmentNoA = parseFloat(a['Assessment No']) || Infinity;
            const assessmentNoB = parseFloat(b['Assessment No']) || Infinity;
            return assessmentNoA - assessmentNoB;
        });

        studentsData = students;
        populateFilters(students);
        applyFilters(); 
        loader.style.display = 'none';
        
        NotificationManager.success(`Loaded ${students.length} student records successfully`);
    }, (error) => {
        console.error("Error fetching students:", error);
        reportSummary.textContent = `Error fetching data: ${error.message}. Please check your Firebase Security Rules.`;
        loader.style.display = 'none';
        NotificationManager.error(`Failed to fetch data: ${error.message}`);
    });
}

function populateFilters(students) {
    const grades = new Set();
    const allKeys = new Set();

    students.forEach(student => {
        if (student['Grade']) {
            grades.add(student['Grade']);
        }
        Object.keys(student).forEach(key => allKeys.add(key));
    });

    gradeFilter.innerHTML = '<option value="">All Grades</option>';
    Array.from(grades).sort().forEach(grade => {
        const option = document.createElement('option');
        option.value = grade;
        option.textContent = `Grade ${grade}`;
        gradeFilter.appendChild(option);
    });

    const excludedFields = [
        'id', 'Assessment No', 'Official Student Name', 'Gender', 
         'Class', 'Grade'
    ]; 
    
    fieldFilter.innerHTML = '<option value="">Select Field...</option>';
    Array.from(allKeys)
        .filter(key => !excludedFields.includes(key))
        .sort()
        .forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            fieldFilter.appendChild(option);
        });
}

function applyFilters() {
    const selectedGrade = gradeFilter.value;
    const selectedField = fieldFilter.value;
    let filtered = studentsData;

    // Apply grade filter
    if (selectedGrade) {
        filtered = filtered.filter(student => student['Grade'] === selectedGrade);
    }

    // Apply field filter (missing data)
    if (selectedField) {
        missingFieldHeader.textContent = `Missing: ${selectedField}`;
        filtered = filtered.filter(student => {
            const value = student[selectedField];
            if (value === undefined || value === null || value === "") {
                return true;
            }
            if (typeof value === 'string' && (value.toUpperCase() === 'NA' || value.toUpperCase() === 'N/A'|| value.toUpperCase() === '---'|| value.toUpperCase() === '-')) {
                return true;
            }
            return false;
        });
    } else {
        missingFieldHeader.textContent = "Missing Field Value";
    }

    // Apply search filter
    if (searchQuery) {
        filtered = filtered.filter(student => {
            const searchableFields = [
                student['Official Student Name'],
                student['Assessment No'],
                student['UPI'],
                student['Grade'],
                student['Term']
            ].map(field => String(field || '').toLowerCase());
            
            return searchableFields.some(field => field.includes(searchQuery));
        });
    }

    filteredAndSearchedStudents = filtered;
    currentPage = 1; // Reset to first page
    renderCurrentPage();
}

// --- Advanced Rendering with Pagination ---

function renderCurrentPage() {
    const selectedField = fieldFilter.value;
    const totalStudents = filteredAndSearchedStudents.length;
    const totalPages = Math.ceil(totalStudents / itemsPerPage);
    
    // Calculate pagination range
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalStudents);
    const studentsToRender = filteredAndSearchedStudents.slice(startIndex, endIndex);

    // Update summary
    let summaryText = `Report Summary: <b style="color: #2980b9;">${totalStudents}</b> students found`;
    if (gradeFilter.value) {
        summaryText += ` in <b style="color: #2980b9;">${gradeFilter.value}</b>`;
    }
    if (selectedField) {
        summaryText += ` with missing value for <b style="color: #2980b9;">${selectedField}</b>`;
    }
    if (searchQuery) {
        summaryText += ` matching <b style="color: #2980b9;">"${searchQuery}"</b>`;
    }
    reportSummary.innerHTML = summaryText + '.';

    // Update pagination info
    if (totalStudents > 0) {
        paginationInfo.textContent = `Showing ${startIndex + 1}-${endIndex} of ${totalStudents} students`;
    } else {
        paginationInfo.textContent = 'No students found';
    }

    // Render table
    tableBody.innerHTML = ''; 

    if (studentsToRender.length === 0) {
        const row = tableBody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 7;
        cell.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #7f8c8d;">
                <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">No students found</div>
                <div style="font-size: 14px;">Try adjusting your filters or search query</div>
            </div>
        `;
        paginationControls.innerHTML = '';
        return;
    }

   studentsToRender.forEach((student, index) => {
    const row = tableBody.insertRow();
    row.dataset.studentId = student.id;
    row.dataset.rowIndex = startIndex + index;
    
    const indexCell = row.insertCell(0);
    indexCell.textContent = (startIndex + index + 1).toString();
    
    row.insertCell(1).textContent = student['Grade'] || 'N/A';
    row.insertCell(2).textContent = student['Official Student Name'] || 'N/A'; 
    row.insertCell(3).textContent = student['Assessment No'] || student.id || 'N/A'; 
    row.insertCell(4).textContent = student['UPI'] || student.id || 'N/A'; 
    row.insertCell(5).textContent = student['Term'] || 'N/A';
    
    const missingValueCell = row.insertCell(6);
    if (selectedField) {
        createEditableCell(missingValueCell, student, selectedField, row);
    } else {
        missingValueCell.textContent = '-'; 
    }
    
    const actionCell = row.insertCell(7);
    if (selectedField) {
        createActionButtons(actionCell, student, selectedField, row);
    }
});
    // Render pagination controls
    renderPaginationControls(totalPages);
}

function renderPaginationControls(totalPages) {
    paginationControls.innerHTML = '';
    
    if (totalPages <= 1) return;

    const buttonStyle = `
        padding: 8px 12px;
        margin: 0 4px;
        border: 2px solid #3498db;
        background: white;
        color: #3498db;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s ease;
    `;

    const activeButtonStyle = `
        padding: 8px 12px;
        margin: 0 4px;
        border: 2px solid #3498db;
        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
        color: white;
        border-radius: 6px;
        cursor: default;
        font-weight: 600;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
    `;

    const disabledButtonStyle = `
        padding: 8px 12px;
        margin: 0 4px;
        border: 2px solid #bdc3c7;
        background: #ecf0f1;
        color: #95a5a6;
        border-radius: 6px;
        cursor: not-allowed;
        font-weight: 600;
        font-size: 14px;
    `;

    // First button
    const firstBtn = document.createElement('button');
    firstBtn.innerHTML = '⟨⟨';
    firstBtn.title = 'First page';
    firstBtn.style.cssText = currentPage === 1 ? disabledButtonStyle : buttonStyle;
    firstBtn.disabled = currentPage === 1;
    firstBtn.onclick = () => goToPage(1);
    paginationControls.appendChild(firstBtn);

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '⟨ Previous';
    prevBtn.style.cssText = currentPage === 1 ? disabledButtonStyle : buttonStyle;
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => goToPage(currentPage - 1);
    paginationControls.appendChild(prevBtn);

    // Page numbers (show current page and 2 pages before/after)
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.style.cssText = 'margin: 0 8px; color: #7f8c8d;';
        paginationControls.appendChild(ellipsis);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.style.cssText = i === currentPage ? activeButtonStyle : buttonStyle;
        
        if (i !== currentPage) {
            pageBtn.onmouseenter = () => {
                pageBtn.style.background = '#3498db';
                pageBtn.style.color = 'white';
            };
            pageBtn.onmouseleave = () => {
                pageBtn.style.background = 'white';
                pageBtn.style.color = '#3498db';
            };
            pageBtn.onclick = () => goToPage(i);
        }
        
        paginationControls.appendChild(pageBtn);
    }

    if (endPage < totalPages) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.style.cssText = 'margin: 0 8px; color: #7f8c8d;';
        paginationControls.appendChild(ellipsis);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = 'Next ⟩';
    nextBtn.style.cssText = currentPage === totalPages ? disabledButtonStyle : buttonStyle;
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => goToPage(currentPage + 1);
    paginationControls.appendChild(nextBtn);

    // Last button
    const lastBtn = document.createElement('button');
    lastBtn.innerHTML = '⟩⟩';
    lastBtn.title = 'Last page';
    lastBtn.style.cssText = currentPage === totalPages ? disabledButtonStyle : buttonStyle;
    lastBtn.disabled = currentPage === totalPages;
    lastBtn.onclick = () => goToPage(totalPages);
    paginationControls.appendChild(lastBtn);
}

function createEditableCell(cell, student, fieldName, row) {
    const value = student[fieldName];
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position: relative; display: flex; align-items: center; gap: 8px;';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input-advanced';
    input.placeholder = 'Enter value...';
    input.dataset.originalValue = value || '';
    
    input.style.cssText = `
        flex: 1;
        padding: 8px 12px;
        border: 2px solid #bdc3c7;
        border-radius: 6px;
        font-size: 14px;
        transition: all 0.3s ease;
        background: white;
    `;
    
    if (value === undefined || value === null || value === "") {
        input.value = '';
        cell.classList.add('missing-value-indicator');
    } else if (typeof value === 'string' && (value.toUpperCase() === 'NA' || value.toUpperCase() === 'N/A')) {
        input.value = '';
        cell.classList.add('missing-value-indicator');
    } else {
        input.value = value;
    }
    
    input.addEventListener('focus', () => {
        input.style.borderColor = '#3498db';
        input.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
        input.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', () => {
        input.style.borderColor = '#bdc3c7';
        input.style.boxShadow = 'none';
        input.style.transform = 'scale(1)';
    });
    
    input.addEventListener('input', () => {
        const hasChanged = input.value.trim() !== input.dataset.originalValue;
        const isEmpty = input.value.trim() === '';
        
        if (hasChanged && !isEmpty) {
            input.style.borderColor = '#f39c12';
            input.style.background = '#fff9e6';
        } else if (isEmpty) {
            input.style.borderColor = '#e74c3c';
            input.style.background = '#ffebee';
        } else {
            input.style.borderColor = '#bdc3c7';
            input.style.background = 'white';
        }
    });
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const saveBtn = row.cells[7].querySelector('.save-btn-advanced');
            if (saveBtn) saveBtn.click();
        }
    });
    
    wrapper.appendChild(input);
    cell.appendChild(wrapper);
}

function createActionButtons(actionCell, student, fieldName, row) {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; gap: 8px; justify-content: center;';
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = '💾 Save';
    saveBtn.className = 'save-btn-advanced';
    saveBtn.style.cssText = `
        padding: 8px 16px;
        background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 13px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(39, 174, 96, 0.3);
    `;
    
    saveBtn.onmouseenter = () => {
        saveBtn.style.transform = 'translateY(-2px)';
        saveBtn.style.boxShadow = '0 4px 12px rgba(39, 174, 96, 0.4)';
    };
    saveBtn.onmouseleave = () => {
        saveBtn.style.transform = 'translateY(0)';
        saveBtn.style.boxShadow = '0 2px 8px rgba(39, 174, 96, 0.3)';
    };
    
    saveBtn.onclick = () => updateStudentFieldAdvanced(student.id, fieldName, row);
    
    const clearBtn = document.createElement('button');
    clearBtn.textContent = '↺';
    clearBtn.className = 'clear-btn-advanced';
    clearBtn.title = 'Reset to original value';
    clearBtn.style.cssText = `
        padding: 8px 12px;
        background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 16px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(149, 165, 166, 0.3);
    `;
    
    clearBtn.onmouseenter = () => {
        clearBtn.style.transform = 'rotate(180deg) scale(1.1)';
    };
    clearBtn.onmouseleave = () => {
        clearBtn.style.transform = 'rotate(0deg) scale(1)';
    };
    
    clearBtn.onclick = () => {
        const input = row.cells[6].querySelector('input');
        if (input) {
            input.value = input.dataset.originalValue;
            input.style.borderColor = '#bdc3c7';
            input.style.background = 'white';
            NotificationManager.info('Value reset to original');
        }
    };
    
    buttonContainer.appendChild(saveBtn);
    buttonContainer.appendChild(clearBtn);
    actionCell.appendChild(buttonContainer);
}

// --- Advanced Update Function with Rich Feedback ---

async function updateStudentFieldAdvanced(studentId, fieldName, row) {
    const { ref, update } = firebaseImports;
    const input = row.cells[6].querySelector('input');
    const newValue = input.value.trim();
    
    if (!newValue) {
        NotificationManager.warning('Please enter a value before saving');
        input.focus();
        input.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => input.style.animation = '', 500);
        return;
    }
    
    const saveBtn = row.cells[7].querySelector('.save-btn-advanced');
    const clearBtn = row.cells[7].querySelector('.clear-btn-advanced');
    const originalBtnContent = saveBtn.innerHTML;
    const studentGrade = row.cells[1].textContent;
    const studentName = row.cells[2].textContent;
    const AssessmentNo = row.cells[3].textContent;
    
    try {
        saveBtn.disabled = true;
        clearBtn.disabled = true;
        saveBtn.innerHTML = '⏳ Saving...';
        saveBtn.style.background = 'linear-gradient(90deg, #3498db, #2980b9, #3498db)';
        saveBtn.style.backgroundSize = '200% 100%';
        saveBtn.style.animation = 'shimmer 1.5s infinite';
        
        input.disabled = true;
        input.style.opacity = '0.6';

        const studentRef = ref(db, `Results/${sanitizedAppId}/students/${studentId}`);
        await update(studentRef, {
            [fieldName]: newValue
        });
        
        saveBtn.innerHTML = '✓ Saved!';
        saveBtn.style.background = 'linear-gradient(135deg, #27ae60 0%, #229954 100%)';
        saveBtn.style.animation = '';
        input.style.borderColor = '#27ae60';
        input.style.background = '#e8f8f5';
        
        const student = studentsData.find(s => s.id === studentId);
        if (student) {
            student[fieldName] = newValue;
        }
        
        NotificationManager.success(
            `<strong>${studentName}  ${studentGrade} Assessment No ${AssessmentNo} </strong><br/>` +
            `<span style="font-size: 12px; opacity: 0.9;">✓ ${fieldName} updated successfully</span>`,
            10000
        );
        
        setTimeout(() => {
            row.style.transition = 'all 0.5s ease';
            row.style.transform = 'translateX(100%)';
            row.style.opacity = '0';
            
            setTimeout(() => {
                applyFilters();
                NotificationManager.info(
                    `Student removed from missing data list`,
                    2000
                );
            }, 500);
        }, 1500);
        
    } catch (error) {
        console.error('Error updating student:', error);
        
        saveBtn.innerHTML = '✕ Failed';
        saveBtn.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
        saveBtn.style.animation = '';
        input.style.borderColor = '#e74c3c';
        
        NotificationManager.error(
            `<strong>Update Failed</strong><br/>` +
            `<span style="font-size: 12px;">${error.message}</span>`,
            5000
        );
        
        setTimeout(() => {
            saveBtn.innerHTML = originalBtnContent;
            saveBtn.style.background = 'linear-gradient(135deg, #27ae60 0%, #229954 100%)';
            saveBtn.disabled = false;
            clearBtn.disabled = false;
            input.disabled = false;
            input.style.opacity = '1';
        }, 2000);
    }
}

// --- PDF Export Function ---

async function exportMissingDataToPdf() {
    if (!window.jspdf) {
        alert('PDF library not loaded. Please refresh the page and try again.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');

    const selectedGrade = gradeFilter.value;
    const selectedField = fieldFilter.value;
    
    // Use all filtered students (not just current page)
    let dataToExport = filteredAndSearchedStudents;

    if (dataToExport.length === 0) {
        alert('No data to export. Please adjust your filters.');
        return;
    }

    const title = selectedField ? `Missing ${selectedField} Report` : `Missing Data Report`;
    const subtitle = selectedField ? `Field: ${selectedField}` : 'All Missing Fields';
    const gradeInfo = selectedGrade ? `Grade ${selectedGrade}` : 'All Grades';
    const totalStudents = dataToExport.length;
    
    const logoImg = new Image();
    logoImg.src = 'logo.png';
    logoImg.crossOrigin = 'anonymous';
    
    await new Promise((resolve) => {
        logoImg.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = logoImg.width;
                canvas.height = logoImg.height;
                
                ctx.drawImage(logoImg, 0, 0);
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                for (let i = 0; i < data.length; i += 4) {
                    const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
                    const lightened = gray + (255 - gray) * 0.6;
                    
                    data[i] = lightened;
                    data[i + 1] = lightened;
                    data[i + 2] = lightened;
                }
                
                ctx.putImageData(imageData, 0, 0);
                logoImg.src = canvas.toDataURL();
            } catch (e) {
                console.warn('Logo filter failed:', e);
            }
            resolve();
        };
        logoImg.onerror = () => {
            console.warn('Logo failed to load');
            resolve();
        };
        setTimeout(resolve, 3000);
    });
    
    const headers = [
           'No.',
           'Term',
           'Assessment No',
           'UPI',
           'Official Student Name', 
           'Gender',
           'MATHS',
           'ENG',
           'KISW',
           'SCI',
           'SSTRE',
           'Overall Score',
           'Mean Grade',
     
    ];
       //selectedField ? `Missing: ${selectedField}` : 'Missing Field Value'
    const body = dataToExport.map((student, index) => {
        const row = [
            String(index + 1),
            String(student['Term'] || 'N/A'),
            String(student['Assessment No'] || 'N/A'),
            String(student['UPI'] || student.id || 'N/A'),
            String(student['Official Student Name'] || 'N/A'),
            String(student['Gender'] || 'N/A'),
            String(student['MATHS'] || 'N/A'),
            String(student['ENG'] || 'N/A'),
            String(student['KISW'] || 'N/A'),
            String(student['SCI'] || 'N/A'),
            String(student['SSTRE'] || 'N/A'),
            String(student['Overall Score'] || 'N/A'),
            String(student['Mean Grade'] || 'N/A'),
          
        ];
        
        if (selectedField) {
            const value = student[selectedField];
            if (value === undefined) {
                row.push('[MISSING - Field Not Present]');
            } else if (value === null || value === "") {
                row.push('[EMPTY]');
            } else if (typeof value === 'string' && (value.toUpperCase() === 'NA' || value.toUpperCase() === 'N/A')) {
                row.push(`[${value.toUpperCase()}]`);
            } else {
                row.push(String(value));
            }
        } else {
            row.push('-');
        }
        
        return row;
    });

    const addHeader = () => {
        const pageWidth = doc.internal.pageSize.width;
        
        doc.setFillColor(41, 128, 185);
        doc.rect(0, 0, pageWidth, 20, 'F');
        
        if (logoImg.complete && logoImg.naturalHeight !== 0) {
            try {
                const logoWidth = 15;
                const logoHeight = 15;
                const logoX = 14;
                const logoY = 2.5;
                doc.addImage(logoImg, 'PNG', logoX, logoY, logoWidth, logoHeight);
            } catch (e) {
                console.warn('Could not add logo to PDF:', e);
            }
        }
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('KANYADET PRI & JUNIOR SCHOOL', 34, 10);
        
        doc.setFontSize(12);
        doc.text(title, 34, 16);
        
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        const dateText = `Date: ${new Date().toLocaleDateString()}`;
        doc.text(dateText, pageWidth - 14, 6, { align: 'right' });
        doc.text(subtitle, pageWidth - 14, 11, { align: 'right' });
        doc.text(gradeInfo, pageWidth - 14, 16, { align: 'right' });
        
        doc.setFontSize(8);
        doc.text(`Total Students: ${totalStudents}`, pageWidth - 14, 20, { align: 'right' });
        
        if (searchQuery) {
            doc.text(`Search: "${searchQuery}"`, pageWidth - 14, 24, { align: 'right' });
        }
        
        doc.setDrawColor(41, 128, 185);
        doc.setLineWidth(0.5);
        doc.line(0, 20, pageWidth, 20);
    };

    const addFooter = (data, totalPages) => {
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const footerY = pageHeight - 15;
        
        doc.setFillColor(245, 245, 245);
        doc.rect(0, footerY - 5, pageWidth, 20, 'F');
        
        doc.setDrawColor(41, 128, 185);
        doc.setLineWidth(0.3);
        doc.line(0, footerY - 5, pageWidth, footerY - 5);
        
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(8);
        
        doc.setFont(undefined, 'bold');
        doc.text('Prepared by:', 14, footerY);
        doc.setFont(undefined, 'normal');
        doc.text('_________________', 14, footerY + 4);
        doc.setFontSize(7);
        doc.text('Signature & Date', 14, footerY + 8);
        
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        const pageText = `Page ${data.pageNumber} of ${totalPages}`;
        doc.text(pageText, pageWidth / 2, footerY + 2, { align: 'center' });
        
        doc.setFontSize(8);
        doc.setFont(undefined, 'bold');
        doc.text('Verified by:', pageWidth - 14, footerY, { align: 'right' });
        doc.setFont(undefined, 'normal');
        doc.text('_________________', pageWidth - 14, footerY + 4, { align: 'right' });
        doc.setFontSize(7);
        doc.text('Signature & Stamp', pageWidth - 14, footerY + 8, { align: 'right' });
        
        doc.setDrawColor(41, 128, 185);
        doc.setLineWidth(0.2);
        doc.rect(pageWidth - 85, footerY - 3, 28, 10);
        doc.setFontSize(6);
        doc.setTextColor(150, 150, 150);
        doc.text('OFFICIAL', pageWidth - 71, footerY + 2, { align: 'center' });
        doc.text('STAMP', pageWidth - 71, footerY + 5, { align: 'center' });
    };

    doc.autoTable({
        head: [headers],
        body: body,
        startY: 25,
        styles: { 
            fontSize: 9,
            cellPadding: 3,
            overflow: 'linebreak',
            cellWidth: 'auto'
        },
        columnStyles: {
            0: { cellWidth: 12 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 'auto' },
            3: { cellWidth: 'auto' },
            4: { cellWidth: 'auto' }
        },
        headStyles: { 
            fillColor: [41, 128, 185], 
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 25, right: 10, bottom: 20, left: 10 },
        didDrawPage: function(data) {
            addHeader();
        }
    });

    const totalPages = doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        addFooter({ pageNumber: i }, totalPages);
    }

    const fieldPart = selectedField ? `_${selectedField.replace(/\s+/g, '_')}` : '';
    const gradePart = selectedGrade ? `_grade${selectedGrade}` : '_all_grades';
    const searchPart = searchQuery ? `_search_${searchQuery.replace(/\s+/g, '_')}` : '';
    const filename = `missing_data_report${fieldPart}${gradePart}${searchPart}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    doc.save(filename);
    
    NotificationManager.success(
        `<strong>PDF Export Complete!</strong><br/>` +
        `<span style="font-size: 12px;">Downloaded: ${filename}<br/>Total records: ${totalStudents}</span>`,
        4000
    );
}

window.exportMissingDataToPdf = exportMissingDataToPdf;