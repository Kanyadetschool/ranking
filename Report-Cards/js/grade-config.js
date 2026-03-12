/**
 * Universal Grade Configuration System
 * Configure once, use for all grade levels
 */

const GRADE_CONFIGS = {
    'lower-primary': {
        id: 'lower-primary',
        name: 'Lower Primary',
        grades: ['Grade 1', 'Grade 2', 'Grade 3'],
        subjects: [
            'Mathematics',
            'English',
            'Kiswahili',
            'Integrated Science',
            'Creative Arts & Social studies'
        ],
        gradeScale: [
            { min: 90, max: 100, grade: '8.0', comment: 'Exceeding Expectation EE1' },
            { min: 75, max: 89, grade: '7.0', comment: 'Exceeding Expectation EE2' },
            { min: 58, max: 74, grade: '6.0', comment: 'Meeting Expectation ME1' },
            { min: 41, max: 57, grade: '5.0', comment: 'Meeting Expectation ME2' },
            { min: 31, max: 40, grade: '4.0', comment: 'Approaching Expectation AE1' },
            { min: 21, max: 30, grade: '3.0', comment: 'Approaching Expectation AE2' },
            { min: 11, max: 20, grade: '2.0', comment: 'Below Expectation BE1' },
            { min: 1, max: 10, grade: '1.0', comment: 'Below Expectation BE2' }
        ],
        remarks: [
            { 
                min: 90, 
                max: 100, 
                remarks: [
                    "Exceeding Expectations! Demonstrates exceptional mastery of competencies across all learning areas. A role model learner.",
                    "Outstanding performance! Shows excellent understanding and application of core competencies. Continue nurturing your talents.",
                    "Exemplary work! Exhibits strong critical thinking and problem-solving skills. Keep up the excellent effort."
                ]
            },
            { 
                min: 75, 
                max: 89, 
                remarks: [
                    "Exceeding Expectations! Good mastery of competencies shown. Continue developing your critical thinking skills.",
                    "Very good performance! Demonstrates strong understanding across learning areas. Keep up the momentum.",
                    "Commendable effort! Shows good application of competencies. Strive for even greater heights next term."
                ]
            },
            { 
                min: 58, 
                max: 74, 
                remarks: [
                    "Meeting Expectations! Shows good progress in understanding competencies. With more practice, you'll achieve even better results.",
                    "Good effort shown! Competencies are developing well. Let's work together to strengthen understanding in all areas.",
                    "Positive progress! You're building strong foundations. Increased engagement will help you reach the next level."
                ]
            },
            { 
                min: 41, 
                max: 57, 
                remarks: [
                    "Approaching Expectations! You're making progress. Let's work together to strengthen your understanding with extra support.",
                    "You're on a learning journey! With focused practice and support, you'll develop stronger competencies.",
                    "Showing potential! Let's team up to build your confidence. Remedial sessions will help unlock your abilities."
                ]
            },
            { 
                min: 31, 
                max: 40, 
                remarks: [
                    "We believe in you! Let's work together with extra support to build your competencies. Remedial classes will help greatly.",
                    "You have potential! With intensive support and practice, you can improve. Let's partner with your parents to help you succeed.",
                    "We're here to help! Together with extra learning support, we'll work on strengthening your understanding step by step."
                ]
            },
            { 
                min: 0, 
                max: 30, 
                remarks: [
                    "Your learning matters! We're creating a comprehensive support plan to help you succeed. Together with your family, we'll find the best path forward.",
                    "We're invested in your success! Let's arrange a meeting to develop an individualized learning strategy with specialized support.",
                    "You're important to us! We're organizing a team approach with extra support to help you grow at your own pace."
                ]
            }
        ],
        term: {
            closingDate: 'FRI 24-01-2025',
            openingDate: 'MON 27-01-2025'
        }
    },
    
    'upper-primary': {
        id: 'upper-primary',
        name: 'Upper Primary',
        grades: ['Grade 4', 'Grade 5', 'Grade 6'],
        subjects: [
            'Mathematics',
            'English',
            'Kiswahili',
            'Integrated Science',
            'Creative Arts & Social studies'
        ],
        gradeScale: [
            { min: 90, max: 100, grade: '8.0', comment: 'Exceeding Expectation EE1' },
            { min: 75, max: 89, grade: '7.0', comment: 'Exceeding Expectation EE2' },
            { min: 58, max: 74, grade: '6.0', comment: 'Meeting Expectation ME1' },
            { min: 41, max: 57, grade: '5.0', comment: 'Meeting Expectation ME2' },
            { min: 31, max: 40, grade: '4.0', comment: 'Approaching Expectation AE1' },
            { min: 21, max: 30, grade: '3.0', comment: 'Approaching Expectation AE2' },
            { min: 11, max: 20, grade: '2.0', comment: 'Below Expectation BE1' },
            { min: 1, max: 10, grade: '1.0', comment: 'Below Expectation BE2' }
        ],
        remarks: [
            { 
                min: 90, 
                max: 100, 
                remarks: [
                    "Exceeding Expectations! Demonstrates exceptional mastery of competencies across all learning areas. A role model learner.",
                    "Outstanding performance! Shows excellent understanding and application of core competencies. Continue nurturing your talents.",
                    "Exemplary work! Exhibits strong critical thinking and problem-solving skills. Keep up the excellent effort."
                ]
            },
            { 
                min: 75, 
                max: 89, 
                remarks: [
                    "Exceeding Expectations! Good mastery of competencies shown. Continue developing your critical thinking skills.",
                    "Very good performance! Demonstrates strong understanding across learning areas. Keep up the momentum.",
                    "Commendable effort! Shows good application of competencies. Strive for even greater heights next term."
                ]
            },
            { 
                min: 58, 
                max: 74, 
                remarks: [
                    "Meeting Expectations! Shows good progress in understanding competencies. With more practice, you'll achieve even better results.",
                    "Good effort shown! Competencies are developing well. Let's work together to strengthen understanding in all areas.",
                    "Positive progress! You're building strong foundations. Increased engagement will help you reach the next level."
                ]
            },
            { 
                min: 41, 
                max: 57, 
                remarks: [
                    "Approaching Expectations! You're making progress. Let's work together to strengthen your understanding with extra support.",
                    "You're on a learning journey! With focused practice and support, you'll develop stronger competencies.",
                    "Showing potential! Let's team up to build your confidence. Remedial sessions will help unlock your abilities."
                ]
            },
            { 
                min: 31, 
                max: 40, 
                remarks: [
                    "We believe in you! Let's work together with extra support to build your competencies. Remedial classes will help greatly.",
                    "You have potential! With intensive support and practice, you can improve. Let's partner with your parents to help you succeed.",
                    "We're here to help! Together with extra learning support, we'll work on strengthening your understanding step by step."
                ]
            },
            { 
                min: 0, 
                max: 30, 
                remarks: [
                    "Your learning matters! We're creating a comprehensive support plan to help you succeed. Together with your family, we'll find the best path forward.",
                    "We're invested in your success! Let's arrange a meeting to develop an individualized learning strategy with specialized support.",
                    "You're important to us! We're organizing a team approach with extra support to help you grow at your own pace."
                ]
            }
        ],
        term: {
            closingDate: 'FRI 24-01-2025',
            openingDate: 'MON 27-01-2025'
        }
    },
    
    'junior-school': {
        id: 'junior-school',
        name: 'Junior School',
        grades: ['Grade 7', 'Grade 8', 'Grade 9'],
        subjects: [
            'Mathematics',
            'English',
            'Kiswahili',
            'Integrated Science',
            'Creative Arts & Social studies'
        ],
        gradeScale: [
            { min: 90, max: 100, grade: '8.0', comment: 'Exceeding Expectation EE1' },
            { min: 75, max: 89, grade: '7.0', comment: 'Exceeding Expectation EE2' },
            { min: 58, max: 74, grade: '6.0', comment: 'Meeting Expectation ME1' },
            { min: 41, max: 57, grade: '5.0', comment: 'Meeting Expectation ME2' },
            { min: 31, max: 40, grade: '4.0', comment: 'Approaching Expectation AE1' },
            { min: 21, max: 30, grade: '3.0', comment: 'Approaching Expectation AE2' },
            { min: 11, max: 20, grade: '2.0', comment: 'Below Expectation BE1' },
            { min: 1, max: 10, grade: '1.0', comment: 'Below Expectation BE2' }
        ],
        remarks: [
            { 
                min: 90, 
                max: 100, 
                remarks: [
                    "Exceptional performance! Keep up the outstanding work.",
                    "Excellent work throughout the term. A role model student.",
                    "Outstanding achievement! Continue with this excellent attitude."
                ]
            },
            { 
                min: 75, 
                max: 89, 
                remarks: [
                    "Very good performance. Keep working hard.",
                    "Commendable effort. Continue to strive for excellence.",
                    "Good progress shown. Aim even higher next term."
                ]
            },
            { 
                min: 58, 
                max: 74, 
                remarks: [
                    "Good effort shown. More focus needed in some areas.",
                    "Satisfactory progress. Keep working consistently.",
                    "Fair performance. Increase your study time."
                ]
            },
            { 
                min: 41, 
                max: 57, 
                remarks: [
                    "More effort required. Seek help when needed.",
                    "Needs improvement. Focus on understanding concepts.",
                    "Additional support needed. Don't hesitate to ask questions."
                ]
            },
            { 
                min: 31, 
                max: 40, 
                remarks: [
                    "Serious effort needed. Attend remedial classes.",
                    "Must work much harder. Seek teacher assistance.",
                    "Needs significant improvement. Extra study required."
                ]
            },
            { 
                min: 0, 
                max: 30, 
                remarks: [
                    "Very poor performance. Urgent parent-teacher conference required.",
                    "Critical attention needed. Immediate remedial action required.",
                    "Extremely poor. Must attend all extra lessons and seek help."
                ]
            }
        ],
        term: {
            closingDate: 'FRI 24-01-2025',
            openingDate: 'MON 27-01-2025'
        }
    }
};

// Helper function to get current configuration
function getCurrentConfig() {
    const configId = document.body.dataset.gradeLevel || 'lower-primary';
    return GRADE_CONFIGS[configId];
}

// Export for use in other scripts
window.GRADE_CONFIGS = GRADE_CONFIGS;
window.getCurrentConfig = getCurrentConfig;