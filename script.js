document.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("hasSubmitted"); 

  const phoneInput = document.getElementById("phn");
  phoneInput.value = "+91 ";

  const isReloaded = performance.navigation.type === 1; 

  if (isReloaded) {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      const data = JSON.parse(savedData);
      document.getElementById("name").value = data.name;
      document.querySelector(`input[name="gender"][value="${data.gender}"]`).checked = true;
      document.getElementById("phn").value = data.phone;
      document.querySelectorAll('input[name="prefer"]').forEach(chk => {
        chk.checked = data.preferences.includes(chk.value);
      });
      document.getElementById("address").value = data.address;
      document.getElementById("zipcode").value = data.zip;
      document.getElementById("country").value = data.country;
      document.getElementById("email").value = data.email;
    }
  }

  document.getElementById("name").addEventListener("input", function () {
    this.value = this.value.replace(/[^A-Za-z\s]/g, "");
  });

  document.getElementById("zipcode").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
  });

  phoneInput.addEventListener("beforeinput", function (e) {
    const cursorPos = this.selectionStart;
    const inputType = e.inputType;
    const isDeleting = inputType === "deleteContentBackward" || inputType === "deleteContentForward";
    if (cursorPos <= 4 && isDeleting) e.preventDefault();

    const afterCode = this.value.slice(4).replace(/\D/g, "");
    if (afterCode.length >= 10 && inputType === "insertText") e.preventDefault();
  });

  phoneInput.addEventListener("input", function () {
    if (!this.value.startsWith("+91 ")) {
      const digits = this.value.replace(/\D/g, "").slice(0, 10);
      this.value = "+91 " + digits;
    } else {
      const digits = this.value.slice(4).replace(/\D/g, "").slice(0, 10);
      this.value = "+91 " + digits;
    }
  });
});

document.getElementById("myForm").addEventListener("submit", function (e) {
  e.preventDefault();
  clearAllErrors();
  let valid = true;

  const name = document.getElementById("name");
  if (!/^[A-Za-z\s]+$/.test(name.value.trim())) {
    showError(name, "Please enter your name");
    valid = false;
  }

  const gender = document.querySelector('input[name="gender"]:checked');
  if (!gender) {
    showError(document.querySelector('input[name="gender"]'), "Please select a gender");
    valid = false;
  }

  const phone = document.getElementById("phn");
  const phoneVal = phone.value.slice(4).trim();
  if (!/^\d{10}$/.test(phoneVal)) {
    showError(phone, "Enter 10-digit phone number");
    valid = false;
  }

  const prefs = document.querySelectorAll('input[name="prefer"]:checked');
  if (prefs.length === 0) {
    showError(document.querySelector('input[name="prefer"]'), "Select at least one preference");
    valid = false;
  }

  const address = document.getElementById("address");
  const addrVal = address.value.trim();
  if (addrVal.length === 0 || addrVal.length > 140) {
    showError(address, "Address must be 1–140 characters");
    valid = false;
  }

  const zip = document.getElementById("zipcode");
  if (!/^\d{6}$/.test(zip.value.trim())) {
    showError(zip, "Enter a 6-digit zip code");
    valid = false;
  }

  const country = document.getElementById("country");
  if (country.value === "") {
    showError(country, "Please select a country");
    valid = false;
  }

  const email = document.getElementById("email");
  const emailVal = email.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
    showError(email, "Enter a valid email");
    valid = false;
  }

  if (valid) {
    const formData = {
      name: name.value.trim(),
      gender: gender.value,
      phone: "+91 " + phoneVal,
      preferences: Array.from(prefs).map(p => p.value),
      address: addrVal,
      zip: zip.value.trim(),
      country: country.value,
      email: emailVal
    };

    localStorage.setItem("formData", JSON.stringify(formData));

    alert("Form submitted!");
    this.reset();
    setTimeout(() => phone.value = "+91 ", 0);
  }
});

function clearAllErrors() {
  document.querySelectorAll(".error").forEach(el => el.remove());
}

function showError(inputElement, message) {
  if (!inputElement) return;

  const container = inputElement.closest(".input-row");
  if (!container) return;

  const existing = container.querySelector(".error");
  if (existing) existing.remove();

  const errorSpan = document.createElement("span");
  errorSpan.className = "error";
  errorSpan.textContent = message;
  container.appendChild(errorSpan);
}

document.getElementById("myForm").addEventListener("reset", function () {
  setTimeout(() => {
    clearAllErrors();
    document.getElementById("phn").value = "+91 ";
  }, 0);
});