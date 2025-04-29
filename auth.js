// Form validation and submission
document.querySelectorAll('.auth-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validate password on registration
        if (form.id === 'register-form') {
            if (!validatePassword(data.password)) {
                showError('Password does not meet requirements');
                return;
            }
            if (data.password !== data['confirm-password']) {
                showError('Passwords do not match');
                return;
            }
        }

        try {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';

            // Simulate API call (replace with actual API endpoint)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Redirect to dashboard on success
            window.location.href = '/dashboard.html';
        } catch (error) {
            showError('An error occurred. Please try again.');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
});

// Password validation
function validatePassword(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    return Object.values(requirements).every(requirement => requirement);
}

// Error handling
function showError(message) {
    // Create error element if it doesn't exist
    let errorElement = document.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        document.querySelector('.auth-form').prepend(errorElement);
    }

    // Show error message
    errorElement.textContent = message;
    errorElement.style.display = 'block';

    // Hide error after 5 seconds
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

// Social login handlers
document.querySelectorAll('.social-button').forEach(button => {
    button.addEventListener('click', () => {
        const provider = button.classList.contains('github') ? 'github' : 'google';
        
        // Show loading state
        const originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        // Simulate social login (replace with actual OAuth flow)
        setTimeout(() => {
            // Reset button state
            button.disabled = false;
            button.innerHTML = originalText;
            
            // Redirect to dashboard
            window.location.href = '/dashboard.html';
        }, 1000);
    });
});

// Password visibility toggle
document.querySelectorAll('input[type="password"]').forEach(input => {
    const wrapper = document.createElement('div');
    wrapper.className = 'password-wrapper';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'password-toggle';
    toggle.innerHTML = '<i class="fas fa-eye"></i>';
    wrapper.appendChild(toggle);

    toggle.addEventListener('click', () => {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        toggle.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
}); 