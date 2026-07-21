document.addEventListener('DOMContentLoaded', () => {
    
    // Determine context based on URL
    let path = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
    path = path.replace('.html', '');
    
    let defaultDestination = '';
    let defaultPackage = '';
    let showDestinationDropdown = false;
    
    switch(path) {
        case 'kashmir-escape':
            defaultDestination = 'North India';
            defaultPackage = 'Kashmir Escape';
            break;
        case 'himachal-explorer':
            defaultDestination = 'North India';
            defaultPackage = 'Himachal Explorer';
            break;
        case 'kerala-retreat':
            defaultDestination = 'South India';
            defaultPackage = 'Kerala Retreat';
            break;
        case 'meghalaya-discovery':
            defaultDestination = 'East India';
            defaultPackage = 'Meghalaya Discovery';
            break;
        case 'rajasthan-royal-circuit':
            defaultDestination = 'West India';
            defaultPackage = 'Rajasthan Royal Circuit';
            break;
        case 'special-tours':
            defaultDestination = 'Special Tours';
            defaultPackage = 'Current Tour';
            break;
        case 'north-india':
            defaultDestination = 'North India';
            defaultPackage = 'North India Regional Tour';
            break;
        case 'south-india':
            defaultDestination = 'South India';
            defaultPackage = 'South India Regional Tour';
            break;
        case 'east-india':
            defaultDestination = 'East India';
            defaultPackage = 'East India Regional Tour';
            break;
        case 'west-india':
            defaultDestination = 'West India';
            defaultPackage = 'West India Regional Tour';
            break;
        case 'index':
        case '':
        default:
            showDestinationDropdown = true;
            defaultPackage = 'General Enquiry';
            break;
    }

    // Function to generate the form HTML
    function getFormHTML(isModal = false) {
        // If it's a modal, force destination dropdown
        const needsDropdown = isModal || showDestinationDropdown;
        
        let destinationField = '';
        if (needsDropdown) {
            destinationField = `
                <div class="col-span-1 md:col-span-2">
                    <label class="block font-label-md text-label-md text-primary mb-2 uppercase">Destination</label>
                    <select name="destination" required class="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface">
                        <option value="" disabled selected>Select Destination</option>
                        <option value="North India">North India</option>
                        <option value="South India">South India</option>
                        <option value="East India">East India</option>
                        <option value="West India">West India</option>
                        <option value="Special Tours">Special Tours</option>
                    </select>
                </div>
            `;
        } else {
            destinationField = `<input type="hidden" name="destination" value="${defaultDestination}">`;
        }

        return `
            <form class="space-y-6 w-full universal-enquiry-form">
                ${destinationField}
                <input type="hidden" name="package" value="${defaultPackage}">
                
                <!-- Honeypot Field -->
                <div style="position: absolute; left: -9999px; top: -9999px;" aria-hidden="true">
                    <input type="text" name="website" autocomplete="off" tabindex="-1">
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block font-label-md text-label-md text-primary mb-2 uppercase">Full Name <span class="text-error">*</span></label>
                        <input name="fullName" required class="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface" placeholder="John Doe" type="text"/>
                    </div>
                    <div>
                        <label class="block font-label-md text-label-md text-primary mb-2 uppercase">Phone Number <span class="text-error">*</span></label>
                        <input name="phone" required class="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface" placeholder="+91 98765 43210" type="tel"/>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block font-label-md text-label-md text-primary mb-2 uppercase">Email Address</label>
                        <input name="email" class="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface" placeholder="john@example.com" type="email"/>
                    </div>
                    <div>
                        <label class="block font-label-md text-label-md text-primary mb-2 uppercase">Travel Date</label>
                        <input name="travelDate" class="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface" type="date"/>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block font-label-md text-label-md text-primary mb-2 uppercase">Adults</label>
                        <input name="adults" min="1" value="2" class="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface" type="number"/>
                    </div>
                    <div>
                        <label class="block font-label-md text-label-md text-primary mb-2 uppercase">Children</label>
                        <input name="children" min="0" value="0" class="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface" type="number"/>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block font-label-md text-label-md text-primary mb-2 uppercase">Budget</label>
                        <select name="budget" class="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface">
                            <option value="Standard">Standard</option>
                            <option value="Premium" selected>Premium</option>
                            <option value="Luxury">Luxury</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-label-md text-label-md text-primary mb-2 uppercase">Hotel Category</label>
                        <select name="hotelPreference" class="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface">
                            <option value="3 Star">3 Star</option>
                            <option value="4 Star" selected>4 Star</option>
                            <option value="5 Star / Heritage">5 Star / Heritage</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block font-label-md text-label-md text-primary mb-2 uppercase">Additional Requirements</label>
                    <textarea name="requests" class="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface" placeholder="E.g., Dietary preferences, specific hotel requests..." rows="3"></textarea>
                </div>

                <button type="submit" class="w-full bg-on-tertiary-container text-on-primary px-8 py-4 rounded-full font-label-md text-label-md hover:shadow-lg hover:shadow-on-tertiary-container/30 transition-all transform hover:-translate-y-1 uppercase tracking-wider mt-4 submit-btn">Request Personalized Quote</button>
                <div class="enquiry-message mt-4 text-center font-label-md text-label-md hidden transition-opacity duration-300"></div>
            </form>
        `;
    }

    // Attach submit logic to a specific form instance
    function attachFormLogic(formElement) {
        const btn = formElement.querySelector('.submit-btn');
        const messageContainer = formElement.querySelector('.enquiry-message');
        const formInitTime = Date.now();
        let isSubmitting = false;
        
        function showError(inputElement, message) {
            let errorDiv = inputElement.nextElementSibling;
            if (!errorDiv || !errorDiv.classList.contains('validation-error')) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'validation-error text-error text-sm mt-1';
                errorDiv.style.color = '#ef4444'; // text-red-500 fallback
                inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
            }
            errorDiv.textContent = message;
            inputElement.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
            inputElement.classList.remove('border-outline-variant', 'focus:border-primary', 'focus:ring-primary');
            inputElement.style.borderColor = '#ef4444'; // red border fallback
        }

        function clearError(inputElement) {
            let errorDiv = inputElement.nextElementSibling;
            if (errorDiv && errorDiv.classList.contains('validation-error')) {
                errorDiv.textContent = '';
            }
            inputElement.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
            inputElement.classList.add('border-outline-variant', 'focus:border-primary', 'focus:ring-primary');
            inputElement.style.borderColor = '';
        }

        function validateForm(form) {
            let isValid = true;
            let firstInvalidField = null;

            const fields = form.elements;
            
            for (let i = 0; i < fields.length; i++) {
                if (['INPUT', 'SELECT', 'TEXTAREA'].includes(fields[i].tagName)) {
                    clearError(fields[i]);
                }
            }

            const checkField = (input, condition, errorMessage) => {
                if (!condition) {
                    showError(input, errorMessage);
                    isValid = false;
                    if (!firstInvalidField) firstInvalidField = input;
                }
            };

            const fullName = form.elements['fullName'];
            if (fullName) {
                const val = fullName.value.trim();
                checkField(fullName, val.length >= 3 && /^[A-Za-z\s]+$/.test(val), "Please enter a valid full name (minimum 3 characters, letters and spaces only).");
            }

            const phone = form.elements['phone'];
            if (phone) {
                const val = phone.value.trim();
                checkField(phone, /^\d{10}$/.test(val), "Please enter exactly 10 digits.");
            }

            const email = form.elements['email'];
            if (email) {
                const val = email.value.trim();
                // Modified regex from user to restrict TLD to 2-4 chars to reject .commm
                const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,4}$/;
                checkField(email, val.length > 0 && email.checkValidity() && emailRegex.test(val), "Please enter a valid email address.");
            }

            const travelDate = form.elements['travelDate'] || form.elements['travelMonth'];
            if (travelDate && travelDate.value) {
                const parts = travelDate.value.split('-');
                if (parts.length === 3) {
                    const selectedYear = parseInt(parts[0], 10);
                    const selectedMonth = parseInt(parts[1], 10) - 1;
                    const selectedDay = parseInt(parts[2], 10);
                    const parsedDate = new Date(selectedYear, selectedMonth, selectedDay);
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    checkField(travelDate, parsedDate >= today, "Travel date cannot be in the past.");
                }
            }

            const adults = form.elements['adults'];
            if (adults) {
                checkField(adults, parseInt(adults.value, 10) >= 1, "Minimum 1 adult is required.");
            }

            const children = form.elements['children'];
            if (children) {
                checkField(children, parseInt(children.value, 10) >= 0, "Children cannot be less than 0.");
            }

            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalidField.focus();
            }

            return isValid;
        }

        formElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (isSubmitting) return;
            
            const website = formElement.elements['website'];
            if (website && website.value.length > 0) {
                return;
            }
            
            if (Date.now() - formInitTime < 2000) {
                messageContainer.textContent = 'Please take a moment before submitting.';
                messageContainer.classList.remove('hidden', 'text-success-green');
                messageContainer.classList.add('text-error');
                return;
            }
            
            const lastSubmit = localStorage.getItem('lastEnquirySubmitTime');
            if (lastSubmit && (Date.now() - parseInt(lastSubmit, 10) < 30000)) {
                messageContainer.textContent = 'Please wait 30 seconds before submitting another enquiry.';
                messageContainer.classList.remove('hidden', 'text-success-green');
                messageContainer.classList.add('text-error');
                return;
            }
            
            const fields = formElement.elements;
            for (let i = 0; i < fields.length; i++) {
                if (['INPUT', 'TEXTAREA'].includes(fields[i].tagName) && !['hidden', 'date', 'month', 'radio', 'checkbox'].includes(fields[i].type)) {
                    if (fields[i].value && typeof fields[i].value === 'string') {
                        fields[i].value = fields[i].value.trim();
                    }
                }
            }
            
            const requests = formElement.elements['requests'];
            if (requests && requests.value) {
                requests.value = requests.value.replace(/[<>\{}]/g, match => {
                    const escapeMap = { '<': '&lt;', '>': '&gt;', '{': '&#123;', '}': '&#125;' };
                    return escapeMap[match];
                });
            }
            
            if (!validateForm(formElement)) {
                return;
            }
            
            isSubmitting = true;
            
            const formData = new FormData(formElement);
            
            // Reformat travelDate to DD-MM-YYYY
            const rawDate = formData.get('travelDate') || formData.get('travelMonth');
            if (rawDate) {
                const parts = rawDate.toString().split('-');
                if (parts.length === 3) {
                    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                    if (formData.has('travelDate')) formData.set('travelDate', formattedDate);
                    if (formData.has('travelMonth')) formData.set('travelMonth', formattedDate);
                }
            }
            
            const originalBtnText = btn.textContent;
            btn.textContent = 'Submitting...';
            btn.disabled = true;
            btn.classList.add('opacity-75', 'cursor-not-allowed');
            
            messageContainer.classList.add('hidden');
            messageContainer.textContent = '';
            
            const ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbyGJ5llUM-FOaW5IkamvI7gOfAAQTclYGUKLu-tkevlXJ2-M3v8_ywjS3-6jOmdjxFESA/exec';
            
            try {
                const response = await fetch(ENDPOINT_URL, {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    messageContainer.textContent = 'Thank you! Your enquiry has been received. Our travel expert will contact you shortly.';
                    messageContainer.classList.remove('hidden', 'text-error');
                    messageContainer.classList.add('text-success-green');
                    formElement.reset();
                } else {
                    throw new Error('Network response was not ok.');
                }
            } catch (error) {
                messageContainer.textContent = 'Oops! Something went wrong. Please try submitting again later.';
                messageContainer.classList.remove('hidden', 'text-success-green');
                messageContainer.classList.add('text-error');
            } finally {
                btn.textContent = originalBtnText;
                btn.disabled = false;
                btn.classList.remove('opacity-75', 'cursor-not-allowed');
                isSubmitting = false;
                localStorage.setItem('lastEnquirySubmitTime', Date.now().toString());
            }
        });
    }

    // 1. Inject Inline Form if Container exists
    const inlineContainer = document.getElementById('enquiry-form-container');
    if (inlineContainer) {
        inlineContainer.innerHTML = getFormHTML(false);
        attachFormLogic(inlineContainer.querySelector('form'));
    }

    // 2. Setup Header Modal
    // The openEnquiryModal function is referenced in the header buttons.
    // Let's create the modal container globally.
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'universal-enquiry-modal';
    modalOverlay.className = 'fixed inset-0 z-[999] bg-scrim/80 backdrop-blur-sm hidden flex items-center justify-center p-4 overflow-y-auto';
    
    const modalContent = `
        <div class="bg-surface border border-outline-variant rounded-2xl w-full max-w-3xl relative overflow-hidden my-auto shadow-2xl transform transition-all">
            <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-on-tertiary-container"></div>
            <button class="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors modal-close-btn">
                <span class="material-symbols-outlined text-3xl">close</span>
            </button>
            <div class="p-8 md:p-12">
                <h2 class="font-headline-md text-headline-md text-primary mb-2 text-center">Plan Your Journey</h2>
                <p class="text-center text-on-surface-variant mb-8">Provide your details, and our luxury travel concierge will craft a personalized itinerary for you.</p>
                <div id="modal-form-wrapper"></div>
            </div>
        </div>
    `;
    modalOverlay.innerHTML = modalContent;
    document.body.appendChild(modalOverlay);

    const modalFormWrapper = document.getElementById('modal-form-wrapper');
    modalFormWrapper.innerHTML = getFormHTML(true); // Always pass true for modal to show Destination dropdown
    attachFormLogic(modalFormWrapper.querySelector('form'));

    // Setup Modal Toggle Logic
    const closeBtn = modalOverlay.querySelector('.modal-close-btn');
    closeBtn.addEventListener('click', () => {
        modalOverlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });

    // We expose a global function for the header buttons
    window.openEnquiryModal = function() {
        modalOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    // Close on click outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
});
