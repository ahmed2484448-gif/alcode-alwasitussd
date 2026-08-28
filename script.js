/* ==================================================
   تطبيق الكود الوسيط
   script.js
================================================== */


/* ==================================================
   المتغيرات
================================================== */

let selectedService = "";
let selectedPayment = "";
let currentUSSD = "";

let deferredInstallPrompt = null;


const HISTORY_KEY =
    "alkod_alwasit_history";

const THEME_KEY =
    "alkod_alwasit_theme";


/* ==================================================
   أسماء الخدمات
================================================== */

const serviceNames = {

    jawwal: "جوال بي",

    palpay: "بال بي",

    bank: "بنك فلسطين"

};


const paymentNames = {

    friend: "الدفع لصديق",

    merchant: "الدفع لتاجر"

};


/* ==================================================
   عناصر الصفحة
================================================== */

const serviceButtons =
    document.querySelectorAll(".service");


const paymentButtons =
    document.querySelectorAll(".payment-type");


const paymentSection =
    document.getElementById("paymentSection");


const receiverGroup =
    document.getElementById("receiverGroup");


const amountGroup =
    document.getElementById("amountGroup");


const notesGroup =
    document.getElementById("notesGroup");


const receiverInput =
    document.getElementById("receiver");


const amountInput =
    document.getElementById("amount");


const notesInput =
    document.getElementById("notes");


const createButton =
    document.getElementById("createButton");


const resultSection =
    document.getElementById("resultSection");


const resultMessage =
    document.getElementById("resultMessage");


const ussdCode =
    document.getElementById("ussdCode");


const callButton =
    document.getElementById("callButton");


const copyButton =
    document.getElementById("copyButton");


const historyContainer =
    document.getElementById("historyContainer");


const clearHistoryButton =
    document.getElementById("clearHistoryButton");


const themeButton =
    document.getElementById("themeButton");


const confirmModal =
    document.getElementById("confirmModal");


const confirmCallButton =
    document.getElementById("confirmCallButton");


const cancelCallButton =
    document.getElementById("cancelCallButton");


const confirmService =
    document.getElementById("confirmService");


const confirmPayment =
    document.getElementById("confirmPayment");


const confirmReceiver =
    document.getElementById("confirmReceiver");


const confirmAmount =
    document.getElementById("confirmAmount");


const confirmPaymentRow =
    document.getElementById("confirmPaymentRow");


const confirmReceiverRow =
    document.getElementById("confirmReceiverRow");


const confirmAmountRow =
    document.getElementById("confirmAmountRow");


/* ==================================================
   أدوات
================================================== */

function cleanNumber(value) {

    return String(value || "")
        .trim()
        .replace(/\s+/g, "");

}


function cleanAmount(value) {

    return String(value || "")
        .trim()
        .replace(/,/g, ".");

}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function showElement(element) {

    if (element) {

        element.classList.remove("hidden");

    }

}


function hideElement(element) {

    if (element) {

        element.classList.add("hidden");

    }

}


/* ==================================================
   التنقل بين الصفحات
================================================== */

const navButtons =
    document.querySelectorAll(".nav-button");


const pages =
    document.querySelectorAll(".page");


navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const target =
            button.dataset.page;

        pages.forEach(page => {

            page.classList.remove(
                "active-page"
            );

        });


        const targetPage =
            document.getElementById(target);


        if (targetPage) {

            targetPage.classList.add(
                "active-page"
            );

        }


        navButtons.forEach(item => {

            item.classList.remove("active");

        });


        button.classList.add("active");


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

});


/* ==================================================
   اختيار جهة التحويل
================================================== */

serviceButtons.forEach(button => {

    button.addEventListener("click", () => {

        serviceButtons.forEach(item => {

            item.classList.remove("active");

        });


        button.classList.add("active");


        selectedService =
            button.dataset.service || "";


        selectedPayment = "";


        paymentButtons.forEach(item => {

            item.classList.remove("active");

        });


        updateServiceFields();


        hideElement(resultSection);

    });

});


/* ==================================================
   اختيار طريقة الدفع
================================================== */

paymentButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (
            selectedService === "bank"
        ) {

            return;

        }


        paymentButtons.forEach(item => {

            item.classList.remove("active");

        });


        button.classList.add("active");


        selectedPayment =
            button.dataset.type || "";

    });

});


/* ==================================================
   تحديث الحقول
================================================== */

function updateServiceFields() {


    /* بنك فلسطين */

    if (
        selectedService === "bank"
    ) {

        hideElement(paymentSection);

        hideElement(receiverGroup);

        hideElement(amountGroup);

        hideElement(notesGroup);


        selectedPayment = "";


        paymentButtons.forEach(button => {

            button.classList.remove(
                "active"
            );

        });


        return;

    }


    /* جوال بي / بال بي */

    showElement(paymentSection);

    showElement(receiverGroup);

    showElement(amountGroup);

    showElement(notesGroup);

}


/* ==================================================
   كود جوال بي
================================================== */

function buildJawwalCode(password) {

    const pin =
        cleanNumber(password);


    const receiver =
        cleanNumber(
            receiverInput.value
        );


    const amount =
        cleanAmount(
            amountInput.value
        );


    if (
        selectedPayment === "friend"
    ) {

        return (
            "*110*1*" +
            pin +
            "*" +
            receiver +
            "*" +
            amount +
            "#"
        );

    }


    if (
        selectedPayment === "merchant"
    ) {

        return (
            "*110*2*" +
            pin +
            "*" +
            receiver +
            "*" +
            amount +
            "#"
        );

    }


    return "";

}


/* ==================================================
   كود بال بي
================================================== */

function buildPalPayCode() {

    const receiver =
        cleanNumber(
            receiverInput.value
        );


    const amount =
        cleanAmount(
            amountInput.value
        );


    if (
        selectedPayment === "friend"
    ) {

        return (
            "*370*1*1*" +
            receiver +
            "*" +
            amount +
            "#"
        );

    }


    if (
        selectedPayment === "merchant"
    ) {

        return (
            "*370*1*2*" +
            receiver +
            "*" +
            amount +
            "#"
        );

    }


    return "";

}


/* ==================================================
   بنك فلسطين
================================================== */

function buildBankCode() {

    return "*267#";

}


/* ==================================================
   زر الاتصال
================================================== */

function updateCallButton() {

    if (!callButton) {

        return;

    }


    if (!currentUSSD) {

        callButton.removeAttribute(
            "href"
        );

        return;

    }


    callButton.href =
        "tel:" + currentUSSD;

}


/* ==================================================
   إنشاء الكود
================================================== */

function createCode() {


    if (!selectedService) {

        alert(
            "يرجى اختيار جهة التحويل أولاً."
        );

        return;

    }


    /* بنك فلسطين */

    if (
        selectedService === "bank"
    ) {

        currentUSSD =
            buildBankCode();


        ussdCode.textContent =
            currentUSSD;


        resultMessage.textContent =
            "تم تجهيز كود بنك فلسطين.";


        updateCallButton();


        showElement(resultSection);


        openConfirmation();


        return;

    }


    /* التحقق من طريقة الدفع */

    if (!selectedPayment) {

        alert(
            "يرجى اختيار طريقة الدفع."
        );

        return;

    }


    const receiver =
        cleanNumber(
            receiverInput.value
        );


    const amount =
        cleanAmount(
            amountInput.value
        );


    if (!receiver) {

        alert(
            "يرجى إدخال رقم المستلم."
        );

        receiverInput.focus();

        return;

    }


    if (
        !amount ||
        Number(amount) <= 0
    ) {

        alert(
            "يرجى إدخال مبلغ صحيح."
        );

        amountInput.focus();

        return;

    }


    /* بال بي */

    if (
        selectedService === "palpay"
    ) {

        currentUSSD =
            buildPalPayCode();


        if (!currentUSSD) {

            alert(
                "تعذر إنشاء كود بال بي."
            );

            return;

        }


        ussdCode.textContent =
            currentUSSD;


        resultMessage.textContent =
            "تم تجهيز كود بال بي.";


        updateCallButton();


        showElement(resultSection);


        openConfirmation();


        return;

    }


    /* جوال بي */

    if (
        selectedService === "jawwal"
    ) {

        currentUSSD = "";


        ussdCode.textContent =
            "سيُطلب الرقم السري";


        resultMessage.textContent =
            "بعد التأكيد أدخل الرقم السري لجوال بي.";


        showElement(resultSection);


        openConfirmation();


        return;

    }

}


/* ==================================================
   زر إنشاء الكود
================================================== */

if (createButton) {

    createButton.addEventListener(
        "click",
        createCode
    );

}


/* ==================================================
   نافذة التأكيد
================================================== */

function openConfirmation() {

    if (!confirmModal) {

        return;

    }


    confirmService.textContent =
        serviceNames[selectedService] || "-";


    if (
        selectedService === "bank"
    ) {

        hideElement(
            confirmPaymentRow
        );

        hideElement(
            confirmReceiverRow
        );

        hideElement(
            confirmAmountRow
        );

    }

    else {

        showElement(
            confirmPaymentRow
        );

        showElement(
            confirmReceiverRow
        );

        showElement(
            confirmAmountRow
        );


        confirmPayment.textContent =
            paymentNames[
                selectedPayment
            ] || "-";


        confirmReceiver.textContent =
            cleanNumber(
                receiverInput.value
            ) || "-";


        const amount =
            cleanAmount(
                amountInput.value
            );


        confirmAmount.textContent =
            amount
                ? amount + " شيكل"
                : "-";

    }


    showElement(confirmModal);

}


/* ==================================================
   إغلاق التأكيد
================================================== */

function closeConfirmation() {

    hideElement(confirmModal);

}


/* ==================================================
   طلب الرقم السري لجوال بي
================================================== */

function askForPassword() {

    return new Promise(resolve => {


        const modal =
            document.createElement("div");


        modal.className =
            "confirm-modal";


        modal.innerHTML = `

            <div class="confirm-overlay"></div>

            <div class="confirm-box">

                <div class="confirm-icon">
                    🔐
                </div>

                <h2>
                    الرقم السري
                </h2>

                <p class="confirm-text">
                    أدخل الرقم السري لجوال بي لإكمال العملية.
                </p>

                <div class="input-group"
                     style="text-align:right;margin-top:15px;">

                    <label>
                        الرقم السري
                    </label>

                    <input
                        id="passwordInput"
                        type="password"
                        inputmode="numeric"
                        autocomplete="off"
                        placeholder="أدخل الرقم السري">

                </div>

                <div class="confirm-buttons">

                    <button
                        id="passwordConfirm"
                        class="confirm-yes"
                        type="button">

                        ✓ متابعة

                    </button>

                    <button
                        id="passwordCancel"
                        class="confirm-no"
                        type="button">

                        إلغاء

                    </button>

                </div>

            </div>
        `;


        document.body.appendChild(modal);


        const passwordInput =
            modal.querySelector(
                "#passwordInput"
            );


        const confirmButton =
            modal.querySelector(
                "#passwordConfirm"
            );


        const cancelButton =
            modal.querySelector(
                "#passwordCancel"
            );


        const overlay =
            modal.querySelector(
                ".confirm-overlay"
            );


        setTimeout(() => {

            passwordInput.focus();

        }, 100);


        function finish(value) {

            modal.remove();

            resolve(value);

        }


        confirmButton.addEventListener(
            "click",
            () => {

                const password =
                    cleanNumber(
                        passwordInput.value
                    );


                if (!password) {

                    alert(
                        "يرجى إدخال الرقم السري."
                    );

                    passwordInput.focus();

                    return;

                }


                finish(password);

            }
        );


        cancelButton.addEventListener(
            "click",
            () => {

                finish(null);

            }
        );


        overlay.addEventListener(
            "click",
            () => {

                finish(null);

            }
        );


        passwordInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    confirmButton.click();

                }


                if (
                    event.key === "Escape"
                ) {

                    finish(null);

                }

            }
        );

    });

}


/* ==================================================
   تنفيذ العملية
================================================== */

if (confirmCallButton) {

    confirmCallButton.addEventListener(
        "click",
        async () => {


            /* بنك فلسطين */

            if (
                selectedService === "bank"
            ) {

                closeConfirmation();


                currentUSSD =
                    "*267#";


                ussdCode.textContent =
                    currentUSSD;


                resultMessage.textContent =
                    "تم إنشاء كود بنك فلسطين.";


                updateCallButton();


                saveHistory();


                window.location.href =
                    "tel:" + currentUSSD;


                return;

            }


            /* جوال بي */

            if (
                selectedService === "jawwal"
            ) {

                closeConfirmation();


                const password =
                    await askForPassword();


                if (!password) {

                    return;

                }


                currentUSSD =
                    buildJawwalCode(
                        password
                    );


                if (!currentUSSD) {

                    alert(
                        "تعذر إنشاء كود جوال بي."
                    );

                    return;

                }


                ussdCode.textContent =
                    currentUSSD;


                resultMessage.textContent =
                    "تم إنشاء كود جوال بي.";


                updateCallButton();


                saveHistory();


                window.location.href =
                    "tel:" + currentUSSD;


                return;

            }


            /* بال بي */

            if (
                selectedService === "palpay"
            ) {

                closeConfirmation();


                currentUSSD =
                    buildPalPayCode();


                if (!currentUSSD) {

                    alert(
                        "تعذر إنشاء كود بال بي."
                    );

                    return;

                }


                ussdCode.textContent =
                    currentUSSD;


                resultMessage.textContent =
                    "تم إنشاء كود بال بي.";


                updateCallButton();


                saveHistory();


                window.location.href =
                    "tel:" + currentUSSD;


                return;

            }

        }
    );

}


/* ==================================================
   إلغاء
================================================== */

if (cancelCallButton) {

    cancelCallButton.addEventListener(
        "click",
        closeConfirmation
    );

}


/* ==================================================
   نسخ الكود
================================================== */

if (copyButton) {

    copyButton.addEventListener(
        "click",
        async () => {


            if (!currentUSSD) {

                alert(
                    "لا يوجد كود لنسخه."
                );

                return;

            }


            try {

                await navigator.clipboard.writeText(
                    currentUSSD
                );


                copyButton.textContent =
                    "✓ تم نسخ الكود";


                setTimeout(() => {

                    copyButton.textContent =
                        "📋 نسخ الكود";

                }, 1800);

            }

            catch (error) {

                const textarea =
                    document.createElement(
                        "textarea"
                    );


                textarea.value =
                    currentUSSD;


                textarea.style.position =
                    "fixed";


                textarea.style.opacity =
                    "0";


                document.body.appendChild(
                    textarea
                );


                textarea.select();


                try {

                    document.execCommand(
                        "copy"
                    );


                    copyButton.textContent =
                        "✓ تم نسخ الكود";

                }

                catch (copyError) {

                    alert(
                        "تعذر نسخ الكود."
                    );

                }


                textarea.remove();

            }

        }
    );

}


/* ==================================================
   سجل الحركات
================================================== */

function getHistory() {

    try {

        const saved =
            localStorage.getItem(
                HISTORY_KEY
            );


        return saved
            ? JSON.parse(saved)
            : [];

    }

    catch (error) {

        return [];

    }

}


/* ==================================================
   حفظ العملية
================================================== */

function saveHistory() {

    const history =
        getHistory();


    const item = {

        id:
            Date.now(),

        service:
            selectedService,

        serviceName:
            serviceNames[
                selectedService
            ] || "-",

        payment:
            selectedPayment,

        paymentName:
            paymentNames[
                selectedPayment
            ] || "",

        receiver:
            receiverInput
                ? cleanNumber(
                    receiverInput.value
                )
                : "",

        amount:
            amountInput
                ? cleanAmount(
                    amountInput.value
                )
                : "",

        notes:
            notesInput
                ? notesInput.value.trim()
                : "",

        code:
            currentUSSD,

        status:
            "تمت العملية",

        date:
            new Date().toLocaleString(
                "ar-PS"
            )

    };


    history.unshift(item);


    try {

        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(
                history.slice(0, 100)
            )
        );

    }

    catch (error) {

        console.log(
            "تعذر حفظ السجل",
            error
        );

    }


    renderHistory();

}


/* ==================================================
   عرض السجل
================================================== */

function renderHistory() {

    if (!historyContainer) {

        return;

    }


    const history =
        getHistory();


    if (!history.length) {

        historyContainer.innerHTML = `

            <div class="empty-history">

                <div class="empty-icon">
                    ◷
                </div>

                <h3>
                    لا توجد حركات بعد
                </h3>

                <p>
                    ستظهر التحويلات هنا بعد إتمام الاتصال.
                </p>

            </div>

        `;

        return;

    }


    historyContainer.innerHTML =
        history.map(
            (item, index) => `

                <div
                    class="history-item"
                    data-id="${item.id}">

                    <button
                        class="history-summary"
                        type="button">

                        <span
                            class="history-summary-info">

                            <span
                                class="history-number">

                                ${index + 1}

                            </span>


                            <span
                                class="history-summary-text">

                                <strong>
                                    ${escapeHTML(
                                        item.serviceName
                                    )}
                                </strong>

                                <small>
                                    ${escapeHTML(
                                        item.date
                                    )}
                                </small>

                                <span
                                    class="operation-done">

                                    ✓ تمت العملية

                                </span>

                            </span>

                        </span>


                        <span
                            class="history-arrow">

                            ‹

                        </span>

                    </button>


                    <div
                        class="history-content">

                        <div
                            class="history-details">


                            <div
                                class="history-detail-row">

                                <span>
                                    الخدمة
                                </span>

                                <strong>
                                    ${escapeHTML(
                                        item.serviceName
                                    )}
                                </strong>

                            </div>


                            ${
                                item.paymentName
                                ? `

                                <div
                                    class="history-detail-row">

                                    <span>
                                        طريقة الدفع
                                    </span>

                                    <strong>
                                        ${escapeHTML(
                                            item.paymentName
                                        )}
                                    </strong>

                                </div>

                                `
                                : ""
                            }


                            ${
                                item.receiver
                                ? `

                                <div
                                    class="history-detail-row">

                                    <span>
                                        رقم المستلم
                                    </span>

                                    <strong>
                                        ${escapeHTML(
                                            item.receiver
                                        )}
                                    </strong>

                                </div>

                                `
                                : ""
                            }


                            ${
                                item.amount
                                ? `

                                <div
                                    class="history-detail-row">

                                    <span>
                                        المبلغ
                                    </span>

                                    <strong>
                                        ${escapeHTML(
                                            item.amount
                                        )}
                                        شيكل
                                    </strong>

                                </div>

                                `
                                : ""
                            }


                            ${
                                item.notes
                                ? `

                                <div
                                    class="history-detail-row">

                                    <span>
                                        الملاحظات
                                    </span>

                                    <strong>
                                        ${escapeHTML(
                                            item.notes
                                        )}
                                    </strong>

                                </div>

                                `
                                : ""
                            }


                            ${
                                item.code
                                ? `

                                <div
                                    class="history-code">

                                    ${escapeHTML(
                                        item.code
                                    )}

                                </div>

                                `
                                : ""
                            }


                            <div
                                class="operation-status">

                                ✓ تمت العملية

                            </div>


                            <button
                                class="delete-history-button"
                                type="button"
                                data-delete-id="${item.id}">

                                🗑 حذف من السجل

                            </button>

                        </div>

                    </div>

                </div>

            `
        ).join("");


    attachHistoryEvents();

}


/* ==================================================
   أحداث السجل
================================================== */

function attachHistoryEvents() {

    const items =
        historyContainer.querySelectorAll(
            ".history-item"
        );


    items.forEach(item => {


        const summary =
            item.querySelector(
                ".history-summary"
            );


        if (summary) {

            summary.addEventListener(
                "click",
                () => {

                    item.classList.toggle(
                        "open"
                    );

                }
            );

        }


        const deleteButton =
            item.querySelector(
                ".delete-history-button"
            );


        if (deleteButton) {

            deleteButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    deleteHistory(
                        Number(
                            deleteButton.dataset
                                .deleteId
                        )
                    );

                }
            );

        }

    });

}


/* ==================================================
   حذف عملية
================================================== */

function deleteHistory(id) {

    const history =
        getHistory();


    const filtered =
        history.filter(
            item =>
                Number(item.id) !==
                Number(id)
        );


    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(filtered)
    );


    renderHistory();

}


/* ==================================================
   مسح السجل
================================================== */

if (clearHistoryButton) {

    clearHistoryButton.addEventListener(
        "click",
        () => {

            const history =
                getHistory();


            if (!history.length) {

                alert(
                    "السجل فارغ بالفعل."
                );

                return;

            }


            if (
                !confirm(
                    "هل أنت متأكد من حذف جميع الحركات؟"
                )
            ) {

                return;

            }


            localStorage.removeItem(
                HISTORY_KEY
            );


            renderHistory();

        }
    );

}


/* ==================================================
   الوضع المظلم والفاتح
================================================== */

function loadTheme() {

    const theme =
        localStorage.getItem(
            THEME_KEY
        );


    if (theme === "light") {

        document.body.classList.add(
            "light-mode"
        );


        if (themeButton) {

            themeButton.textContent =
                "🌙";

        }

    }

    else {

        document.body.classList.remove(
            "light-mode"
        );


        if (themeButton) {

            themeButton.textContent =
                "☀️";

        }

    }

}


if (themeButton) {

    themeButton.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "light-mode"
            );


            const isLight =
                document.body.classList.contains(
                    "light-mode"
                );


            localStorage.setItem(
                THEME_KEY,
                isLight
                    ? "light"
                    : "dark"
            );


            themeButton.textContent =
                isLight
                    ? "🌙"
                    : "☀️";

        }
    );

}


/* ==================================================
   نافذة تثبيت التطبيق
================================================== */

const installButton =
    document.getElementById(
        "installButton"
    );


const installModal =
    document.getElementById(
        "installModal"
    );


const closeInstallButton =
    document.getElementById(
        "closeInstallButton"
    );


const closeInstallButton2 =
    document.getElementById(
        "closeInstallButton2"
    );


const nativeInstallButton =
    document.getElementById(
        "nativeInstallButton"
    );


function openInstallModal() {

    showElement(installModal);

}


function closeInstallModal() {

    hideElement(installModal);

}


if (installButton) {

    installButton.addEventListener(
        "click",
        openInstallModal
    );

}


if (closeInstallButton) {

    closeInstallButton.addEventListener(
        "click",
        closeInstallModal
    );

}


if (closeInstallButton2) {

    closeInstallButton2.addEventListener(
        "click",
        closeInstallModal
    );

}


/* ==================================================
   تثبيت PWA على أندرويد
================================================== */

window.addEventListener(
    "beforeinstallprompt",
    event => {

        event.preventDefault();

        deferredInstallPrompt =
            event;


        if (nativeInstallButton) {

            showElement(
                nativeInstallButton
            );

        }

    }
);


if (nativeInstallButton) {

    nativeInstallButton.addEventListener(
        "click",
        async () => {

            if (!deferredInstallPrompt) {

                return;

            }


            deferredInstallPrompt.prompt();


            await deferredInstallPrompt.userChoice;


            deferredInstallPrompt = null;


            hideElement(
                nativeInstallButton
            );

        }
    );

}


/* ==================================================
   إغلاق النوافذ بزر Escape
================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeConfirmation();

            closeInstallModal();

        }

    }
);


/* ==================================================
   تشغيل التطبيق
================================================== */

loadTheme();

renderHistory();

updateServiceFields();

updateCallButton();


/* ==================================================
   Service Worker
================================================== */

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "service-worker.js"
                )
                .then(() => {

                    console.log(
                        "Service Worker يعمل بنجاح"
                    );

                })
                .catch(error => {

                    console.log(
                        "Service Worker error:",
                        error
                    );

                });

        }
    );

}