// Form handling and validation functionality

class FormHandler {
    constructor() {
        this.init();
    }

    init() {
        this.initContactForms();
        this.initNewsletterForms();
        this.initFileUploads();
        this.initFormValidation();
    }

    initContactForms() {
        const contactForms = document.querySelectorAll('.contact-form, #contact-form');
        contactForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmission(form);
            });
        });
    }

    initNewsletterForms() {
        const newsletterForms = document.querySelectorAll('.newsletter-form, #newsletter-form');
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmission(form);
            });
        });
    }

    initFileUploads() {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleFileUpload(e.target);
            });
        });

        // Drag and drop functionality
        const uploadAreas = document.querySelectorAll('.upload-area');
        uploadAreas.forEach(area => {
            area.addEventListener('dragover', (e) => {
                e.preventDefault();
                area.classList.add('drag-over');
            });

            area.addEventListener('dragleave', () => {
                area.classList.remove('drag-over');
            });

            area.addEventListener('drop', (e) => {
                e.preventDefault();
                area.classList.remove('drag-over');
                this.handleFileDrop(e.dataTransfer.files, area);
            });
        });
    }

    initFormValidation() {
        const inputs = document.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let errorMessage = '';

        // Remove existing error states
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        if (!isValid) {
            field.classList.add('error');
            const errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.textContent = errorMessage;
            field.parentNode.appendChild(errorEl);
        }

        return isValid;
    }

    async handleContactSubmission(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Validate all fields
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showMessage('Please correct the errors above', 'error');
            return;
        }

        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));

            this.showMessage('Thank you! Your message has been sent successfully.', 'success');
            form.reset();
            
        } catch (error) {
            this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleNewsletterSubmission(form) {
        const email = form.querySelector('input[type="email"]').value;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        try {
            submitBtn.innerHTML = 'Subscribing...';
            submitBtn.disabled = true;

            // Simulate newsletter subscription
            await new Promise(resolve => setTimeout(resolve, 1500));

            this.showMessage('Successfully subscribed to our newsletter!', 'success');
            form.reset();
            
        } catch (error) {
            this.showMessage('Error subscribing. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = 'Subscribe';
            submitBtn.disabled = false;
        }
    }

    handleFileUpload(input) {
        const files = Array.from(input.files);
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        files.forEach(file => {
            if (!allowedTypes.includes(file.type)) {
                this.showMessage(`File type ${file.type} is not allowed`, 'error');
                return;
            }

            if (file.size > maxSize) {
                this.showMessage(`File ${file.name} is too large (max 5MB)`, 'error');
                return;
            }

            this.displayUploadedFile(file, input);
        });
    }

    handleFileDrop(files, area) {
        const fileInput = area.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.files = files;
            this.handleFileUpload(fileInput);
        }
    }

    displayUploadedFile(file, input) {
        const container = input.closest('.upload-container') || input.parentNode;
        const fileList = container.querySelector('.uploaded-files') || this.createFileList(container);
        
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span class="file-name">${file.name}</span>
            <span class="file-size">(${this.formatFileSize(file.size)})</span>
            <button type="button" class="remove-file" aria-label="Remove file">×</button>
        `;

        fileItem.querySelector('.remove-file').addEventListener('click', () => {
            fileItem.remove();
            if (fileList.children.length === 0) {
                fileList.remove();
            }
        });

        fileList.appendChild(fileItem);
    }

    createFileList(container) {
        const fileList = document.createElement('div');
        fileList.className = 'uploaded-files';
        container.appendChild(fileList);
        return fileList;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());

        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;

        // Insert at top of page or near form
        const targetElement = document.querySelector('main') || document.body;
        targetElement.insertBefore(messageEl, targetElement.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
}

// Initialize form handling when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FormHandler();
});