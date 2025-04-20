jQuery(document).ready(function($) {
    const dobInput = $('#dob');
    const calculateBtn = $('#calculate-age-btn');
    const ageDisplay = $('#age-display');
    const ageResultDiv = $('#age-result');
    const errorDiv = $('#age-calculator-error');

    let ageInterval = null;

    function updateAgeDisplay(years, months, days, hours, minutes, seconds) {
        ageDisplay.html(`${years} Years, ${months} Months, ${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`);
        ageResultDiv.show();
    }

    function calculateAndDisplayAge(birthDate) {
        clearInterval(ageInterval); // Clear any previous interval

        const updateAge = () => {
            const now = new Date();
            const diff = now - birthDate; // Difference in milliseconds

            if (diff < 0) {
                // Handle future date error
                errorDiv.text('Please select a date and time in the past.');
                ageResultDiv.hide();
                clearInterval(ageInterval);
                return;
            }

            errorDiv.text(''); // Clear previous errors

            const totalSeconds = Math.floor(diff / 1000);
            const seconds = totalSeconds % 60;
            const totalMinutes = Math.floor(totalSeconds / 60);
            const minutes = totalMinutes % 60;
            const totalHours = Math.floor(totalMinutes / 60);
            const hours = totalHours % 24;
            const totalDays = Math.floor(totalHours / 24);

            // Approximate calculation for months and years (more accurate but complex date math is possible)
            // This is a simplified approach for demonstration
            let years = birthDate.getFullYear();
            let months = birthDate.getMonth();
            let days = birthDate.getDate();

            const nowYears = now.getFullYear();
            const nowMonths = now.getMonth();
            const nowDays = now.getDate();

            let ageYears = nowYears - years;
            let ageMonths = nowMonths - months;
            let ageDays = nowDays - days;

            if (ageDays < 0) {
                ageMonths--;
                const lastMonth = new Date(nowYears, nowMonths, 0); // Day 0 of current month is last day of previous
                ageDays = nowDays + (lastMonth.getDate() - days);
            }

            if (ageMonths < 0) {
                ageYears--;
                ageMonths += 12;
            }

            // Ensure components are non-negative (edge case handling)
             ageYears = Math.max(0, ageYears);
             ageMonths = Math.max(0, ageMonths);
             ageDays = Math.max(0, ageDays);


            // Recalculate hours, minutes, seconds based on the remaining time after years, months, days
            const birthDateThisYear = new Date(nowYears, birthDate.getMonth(), birthDate.getDate(), birthDate.getHours(), birthDate.getMinutes(), birthDate.getSeconds());
            let remainingDiff = now - birthDateThisYear;

             if (birthDateThisYear > now) {
                 // If birthday hasn't occurred yet this year
                 const birthDateLastYear = new Date(nowYears - 1, birthDate.getMonth(), birthDate.getDate(), birthDate.getHours(), birthDate.getMinutes(), birthDate.getSeconds());
                  remainingDiff = now - birthDateLastYear;
             }

             const remTotalSeconds = Math.floor(remainingDiff / 1000);
             const remSeconds = remTotalSeconds % 60;
             const remTotalMinutes = Math.floor(remTotalSeconds / 60);
             const remMinutes = remTotalMinutes % 60;
             const remTotalHours = Math.floor(remTotalMinutes / 60);
             const remHours = remTotalHours % 24;


            updateAgeDisplay(ageYears, ageMonths, ageDays, remHours, remMinutes, remSeconds);
        };

        updateAge(); // Initial calculation
        ageInterval = setInterval(updateAge, 1000); // Update every second
    }


    calculateBtn.on('click', function() {
        const dobValue = dobInput.val();

        if (!dobValue) {
            errorDiv.text('Please select your Date and Time of Birth.');
            ageResultDiv.hide();
            clearInterval(ageInterval);
            return;
        }

        const birthDate = new Date(dobValue);

        // Basic validation for a valid Date object
        if (isNaN(birthDate.getTime())) {
             errorDiv.text('Invalid Date and Time format.');
             ageResultDiv.hide();
             clearInterval(ageInterval);
             return;
        }


        // Perform an AJAX call (even if the calculation is client-side, this demonstrates the AJAX setup)
        $.ajax({
            url: ageCalculatorAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'calculate_age', // The AJAX action registered in PHP
                dob: dobValue // Send the date of birth to the server (optional for this calculation)
            },
            success: function(response) {
                // Assuming the server just sends a success response
                // The main calculation happens here in the success callback for real-time updates
                 calculateAndDisplayAge(birthDate);
            },
            error: function(error) {
                errorDiv.text('An error occurred during calculation.');
                ageResultDiv.hide();
                clearInterval(ageInterval);
                console.error("AJAX error: ", error);
            }
        });
    });

    // Optional: Clear interval if the input changes after calculation
    dobInput.on('change', function() {
         clearInterval(ageInterval);
         ageDisplay.html(`-- Years, -- Months, -- Days, -- Hours, -- Minutes, -- Seconds`);
         ageResultDiv.hide();
         errorDiv.text('');
    });
});
