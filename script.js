/* ==================================================
   تطبيق الكود الوسيط
   script.js
================================================== */

let selectedService = "";
let selectedPayment = "";

let currentUSSD = "";
let pendingCallHref = "";

const HISTORY_KEY = "alkod_alwasit_history";
const THEME_KEY = "alkod_alwasit_theme";


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
   العناصر
================================================== */

const serviceButtons =
    document.querySelectorAll(".service");

const paymentButtons =
    document.querySelectorAll(".payment-type");

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

const historyToggle =
    document.getElementById("historyToggle");

const historyCard =
    document.querySelector(".history-card");

const historyPanel =
    document.getElementById("historyPanel");

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
   أدوات مساعدة
================================================== */

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

        updateServiceFields();

    });

});


/* ==================================================
   اختيار طريقة الدفع
================================================== */

paymentButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (selectedService === "bank") {
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
   تحديث الحقول حسب الخدمة
================================================== */

function updateServiceFields() {

    if (selectedService === "bank") {

        hideElement(receiverGroup);
        hideElement(amountGroup);
        hideElement(notesGroup);

        paymentButtons.forEach(button => {
            button.classList.remove("active");
        });

        selectedPayment = "";

        return;
    }

    showElement(receiverGroup);
    showElement(amountGroup);
    showElement(notesGroup);

}


/* ==================================================
   إنشاء كود جوال بي
================================================== */

/*
   جوال بي - الدفع لصديق:

   *110*1*الرقم السري*رقم المستلم*المبلغ#

   جوال بي - الدفع لتاجر:

   *110*2*الرقم السري*رقم المستلم*المبلغ#
*/

function buildJawwalCode(password) {

    const cleanPassword =
        cleanNumber(password);

    const receiver =
        cleanNumber(
            receiverInput.value
        );

    const amount =
        cleanAmount(
            amountInput.value
        );

    if (selectedPayment === "friend") {

        return (
            "*110*1*" +
            cleanPassword +
            "*" +
            receiver +
            "*" +
            amount +
            "#"
        );

    }

    if (selectedPayment === "merchant") {

        return (
            "*110*2*" +
            cleanPassword +
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
   إنشاء كود بال بي
================================================== */

/*
   بال بي - الدفع لصديق:

   *370*1*1*رقم المستلم*المبلغ#

   بال بي - الدفع لتاجر:

   *370*1*2*رقم المستلم*المبلغ#
*/

function buildPalPayCode() {

    const receiver =
        cleanNumber(
            receiverInput.value
        );

    const amount =
        cleanAmount(
            amountInput.value
        );

    if (selectedPayment === "friend") {

        return (
            "*370*1*1*" +
            receiver +
            "*" +
            amount +
            "#"
        );

    }

    if (selectedPayment === "merchant") {

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
   تحديث زر تنفيذ التحويل
================================================== */

function updateCallButton() {

    if (!callButton) {
        return;
    }

    if (!currentUSSD) {

        callButton.removeAttribute("href");

        return;
    }

    callButton.href =
        "tel:" +
        currentUSSD;

}


/* ==================================================
   إنشاء العملية
================================================== */

function createCode() {

    if (!selectedService) {

        alert(
            "يرجى اختيار جهة التحويل أولاً."
        );

        return;
    }


    /* =========================================
       بنك فلسطين
    ========================================= */

    if (selectedService === "bank") {

        currentUSSD =
            buildBankCode();

        pendingCallHref =
            "tel:" +
            currentUSSD;

        ussdCode.textContent =
            currentUSSD;

        resultMessage.textContent =
            "سيتم الاتصال بكود بنك فلسطين.";

        updateCallButton();

        showElement(resultSection);

        openConfirmation();

        return;
    }


    /* =========================================
       طريقة الدفع
    ========================================= */

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


    /* =========================================
       جوال بي
    ========================================= */

    if (selectedService === "jawwal") {

        currentUSSD = "";

        ussdCode.textContent =
            "سيُطلب الرقم السري";

        resultMessage.textContent =
            "بعد التأكيد سيُطلب منك الرقم السري لجوال بي.";

        updateCallButton();

        showElement(resultSection);

        openConfirmation();

        return;
    }


    /* =========================================
       بال بي
    ========================================= */

    if (selectedService === "palpay") {

        currentUSSD =
            buildPalPayCode();

        if (!currentUSSD) {

            alert(
                "تعذر إنشاء كود العملية."
            );

            return;
        }

        pendingCallHref =
            "tel:" +
            currentUSSD;

        ussdCode.textContent =
            currentUSSD;

        resultMessage.textContent =
            "تم تجهيز كود العملية.";

        updateCallButton();

        showElement(resultSection);

        openConfirmation();

    }

}


/* ==================================================
   زر إنشاء العملية
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


    if (selectedPayment) {

        showElement(
            confirmPaymentRow
        );

        confirmPayment.textContent =
            paymentNames[selectedPayment] || "-";

    } else {

        hideElement(
            confirmPaymentRow
        );

    }


    const receiver =
        cleanNumber(
            receiverInput
                ? receiverInput.value
                : ""
        );


    const amount =
        cleanAmount(
            amountInput
                ? amountInput.value
                : ""
        );


    if (selectedService === "bank") {

        hideElement(
            confirmReceiverRow
        );

        hideElement(
            confirmAmountRow
        );

    } else {

        showElement(
            confirmReceiverRow
        );

        showElement(
            confirmAmountRow
        );

        confirmReceiver.textContent =
            receiver || "-";

        confirmAmount.textContent =
            amount
                ? amount + " شيكل"
                : "-";

    }


    showElement(confirmModal);

}


/* ==================================================
   إغلاق نافذة التأكيد
================================================== */

function closeConfirmation() {

    hideElement(confirmModal);

}


/* ==================================================
   نافذة الرقم السري لجوال بي
================================================== */

function askForJawwalPassword() {

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
                    أدخل الرقم السري لجوال بي لإكمال الاتصال.
                </p>

                <div
                    class="input-group"
                    style="text-align:right;"
                >

                    <label
                        for="jawwalPasswordInput"
                    >
                        الرقم السري
                    </label>

                    <input
                        id="jawwalPasswordInput"
                        type="password"
                        inputmode="numeric"
                        autocomplete="off"
                        maxlength="20"
                        placeholder="أدخل الرقم السري"
                    >

                </div>

                <div class="confirm-buttons">

                    <button
                        id="jawwalPasswordConfirm"
                        class="confirm-yes"
                        type="button"
                    >
                        ✓ متابعة الاتصال
                    </button>

                    <button
                        id="jawwalPasswordCancel"
                        class="confirm-no"
                        type="button"
                    >
                        إلغاء
                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(modal);


        const passwordInput =
            modal.querySelector(
                "#jawwalPasswordInput"
            );

        const confirmButton =
            modal.querySelector(
                "#jawwalPasswordConfirm"
            );

        const cancelButton =
            modal.querySelector(
                "#jawwalPasswordCancel"
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

                if (event.key === "Enter") {

                    confirmButton.click();

                }

                if (event.key === "Escape") {

                    finish(null);

                }

            }
        );

    });

}


/* ==================================================
   تأكيد الاتصال
================================================== */

if (confirmCallButton) {

    confirmCallButton.addEventListener(
        "click",
        async () => {


            /* =================================
               جوال بي
            ================================= */

            if (
                selectedService === "jawwal"
            ) {

                closeConfirmation();


                const password =
                    await askForJawwalPassword();


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


                pendingCallHref =
                    "tel:" +
                    currentUSSD;


                ussdCode.textContent =
                    currentUSSD;


                resultMessage.textContent =
                    "تم تجهيز كود الاتصال.";


                updateCallButton();


                saveHistory();


                window.location.href =
                    pendingCallHref;


                return;

            }


            /* =================================
               بنك فلسطين
            ================================= */

            if (
                selectedService === "bank"
            ) {

                closeConfirmation();


                currentUSSD =
                    buildBankCode();


                pendingCallHref =
                    "tel:" +
                    currentUSSD;


                ussdCode.textContent =
                    currentUSSD;


                updateCallButton();


                saveHistory();


                window.location.href =
                    pendingCallHref;


                return;

            }


            /* =================================
               بال بي
            ================================= */

            if (
                selectedService === "palpay"
            ) {

                closeConfirmation();


                if (!currentUSSD) {

                    alert(
                        "لم يتم إنشاء كود العملية."
                    );

                    return;

                }


                updateCallButton();


                saveHistory();


                window.location.href =
                    pendingCallHref;

            }

        }
    );

}


/* ==================================================
   زر الإلغاء
================================================== */

if (cancelCallButton) {

    cancelCallButton.addEventListener(
        "click",
        closeConfirmation
    );

}


/* ==================================================
   نسخ كود USSD
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


                const oldText =
                    copyButton.textContent;


                copyButton.textContent =
                    "✓ تم نسخ الكود";


                setTimeout(() => {

                    copyButton.textContent =
                        oldText;

                }, 1800);

            } catch (error) {

                const temp =
                    document.createElement(
                        "textarea"
                    );


                temp.value =
                    currentUSSD;


                temp.style.position =
                    "fixed";

                temp.style.opacity =
                    "0";


                document.body.appendChild(
                    temp
                );


                temp.focus();

                temp.select();


                try {

                    document.execCommand(
                        "copy"
                    );


                    copyButton.textContent =
                        "✓ تم نسخ الكود";


                    setTimeout(() => {

                        copyButton.textContent =
                            "📋 نسخ الكود";

                    }, 1800);

                } catch (copyError) {

                    alert(
                        "تعذر نسخ الكود تلقائيًا. يمكنك تحديده ونسخه يدويًا."
                    );

                }


                temp.remove();

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


        if (!saved) {
            return [];
        }


        const data =
            JSON.parse(saved);


        if (!Array.isArray(data)) {
            return [];
        }


        return data;

    } catch (error) {

        console.log(
            "خطأ في قراءة السجل",
            error
        );

        return [];

    }

}


/* ==================================================
   حفظ الحركة
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
            ] || selectedService,

        payment:
            selectedPayment,

        paymentName:
            paymentNames[
                selectedPayment
            ] || "",

        receiver:
            cleanNumber(
                receiverInput
                    ? receiverInput.value
                    : ""
            ),

        amount:
            cleanAmount(
                amountInput
                    ? amountInput.value
                    : ""
            ),

        notes:
            notesInput
                ? notesInput.value.trim()
                : "",

        code:
            currentUSSD,

        status:
            "تمت العملية",

        completed:
            true,

        date:
            new Date().toLocaleString(
                "ar-PS"
            )

    };


    history.unshift(item);


    const limitedHistory =
        history.slice(0, 100);


    try {

        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(
                limitedHistory
            )
        );

    } catch (error) {

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


    if (history.length === 0) {

        historyContainer.innerHTML = `

            <div class="empty-history">
                لا توجد عمليات حتى الآن
            </div>

        `;

        return;
    }


    historyContainer.innerHTML =
        history.map(
            (item, index) => {

                return `

                    <div
                        class="history-item"
                        data-id="${item.id}"
                    >

                        <button
                            class="history-summary"
                            type="button"
                        >

                            <span
                                class="history-summary-info"
                            >

                                <span
                                    class="history-number"
                                >
                                    ${index + 1}
                                </span>


                                <span
                                    class="history-summary-text"
                                >

                                    <strong>
                                        ${escapeHTML(
                                            item.serviceName ||
                                            "عملية"
                                        )}
                                    </strong>


                                    <small>
                                        ${escapeHTML(
                                            item.date || ""
                                        )}
                                    </small>


                                    <span
                                        class="operation-done"
                                    >
                                        ✓ تمت العملية
                                    </span>

                                </span>

                            </span>


                            <span
                                class="history-arrow"
                            >
                                ‹
                            </span>

                        </button>


                        <div
                            class="history-content"
                        >

                            <div
                                class="history-details"
                            >

                                <div
                                    class="history-detail-row"
                                >

                                    <span>
                                        الخدمة
                                    </span>

                                    <strong>
                                        ${escapeHTML(
                                            item.serviceName || "-"
                                        )}
                                    </strong>

                                </div>


                                ${
                                    item.paymentName
                                        ? `

                                    <div
                                        class="history-detail-row"
                                    >

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
                                        class="history-detail-row"
                                    >

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
                                        class="history-detail-row"
                                    >

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
                                        class="history-detail-row"
                                    >

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
                                        class="history-code"
                                    >
                                        ${escapeHTML(
                                            item.code
                                        )}
                                    </div>

                                    `
                                        : ""
                                }


                                <div
                                    class="operation-status"
                                >
                                    ✓ تمت العملية
                                </div>


                                <button
                                    class="delete-history-button"
                                    type="button"
                                    data-delete-id="${item.id}"
                                >
                                    🗑 حذف من السجل
                                </button>

                            </div>

                        </div>

                    </div>

                `;

            }
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


                    const id =
                        Number(
                            deleteButton.dataset
                                .deleteId
                        );


                    deleteHistory(id);

                }
            );

        }

    });

}


/* ==================================================
   حذف حركة
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


    try {

        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(filtered)
        );

    } catch (error) {

        console.log(error);

    }


    renderHistory();

}


/* ==================================================
   حذف كل السجل
================================================== */

if (clearHistoryButton) {

    clearHistoryButton.addEventListener(
        "click",
        () => {

            const history =
                getHistory();


            if (history.length === 0) {

                alert(
                    "السجل فارغ بالفعل."
                );

                return;
            }


            const confirmed =
                confirm(
                    "هل أنت متأكد من حذف جميع الحركات؟"
                );


            if (!confirmed) {
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
   فتح وإغلاق السجل
================================================== */

if (historyToggle) {

    historyToggle.addEventListener(
        "click",
        () => {

            if (!historyCard) {
                return;
            }


            historyCard.classList.toggle(
                "open"
            );


            const isOpen =
                historyCard.classList.contains(
                    "open"
                );


            historyToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );

}


/* ==================================================
   الوضع الليلي والفاتح
================================================== */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            THEME_KEY
        );


    if (savedTheme === "light") {

        document.body.classList.add(
            "light-mode"
        );


        if (themeButton) {

            themeButton.textContent =
                "🌙";

        }

    } else {

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
   حماية النصوص
================================================== */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* ==================================================
   زر Escape
================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeConfirmation();

        }

    }
);


/* ==================================================
   التشغيل
================================================== */

loadTheme();

renderHistory();

updateServiceFields();

updateCallButton();


/* ==================================================
   Service Worker
================================================== */

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "service-worker.js"
                )
                .then(
                    () => {

                        console.log(
                            "Service Worker registered."
                        );

                    }
                )
                .catch(
                    error => {

                        console.log(
                            "Service Worker error:",
                            error
                        );

                    }
                );

        }
    );

}