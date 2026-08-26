/* =========================================
   تطبيق الكود الوسيط
   script.js
========================================= */

let selectedService = "";
let selectedPayment = "";

let currentUSSD = "";
let pendingCallHref = "";

const HISTORY_KEY = "alkod_alwasit_history";


/* =========================================
   أسماء الخدمات
========================================= */

const serviceNames = {
    jawwal: "جوال بي",
    palpay: "بال بي",
    bank: "بنك فلسطين"
};

const paymentNames = {
    friend: "الدفع لصديق",
    merchant: "الدفع لتاجر"
};


/* =========================================
   العناصر
========================================= */

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

const historyToggle =
    document.getElementById("historyToggle");

const historyPanel =
    document.getElementById("historyPanel");

const historyCard =
    document.querySelector(".history-card");

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


/* =========================================
   إنشاء حقل الرقم السري لجوال بي
========================================= */

const passwordGroup =
    document.createElement("div");

passwordGroup.id =
    "passwordGroup";

passwordGroup.className =
    "input-group hidden";

passwordGroup.innerHTML = `
    <label for="password">
        الرقم السري
    </label>

    <input
        id="password"
        type="password"
        inputmode="numeric"
        autocomplete="off"
        placeholder="أدخل الرقم السري"
    >
`;

if (receiverGroup) {
    receiverGroup.parentNode.insertBefore(
        passwordGroup,
        receiverGroup
    );
}

const passwordInput =
    document.getElementById("password");


/* =========================================
   إخفاء/إظهار
========================================= */

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


/* =========================================
   اختيار جهة التحويل
========================================= */

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


/* =========================================
   اختيار نوع الدفع
========================================= */

paymentButtons.forEach(button => {

    button.addEventListener("click", () => {

        paymentButtons.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        selectedPayment =
            button.dataset.type || "";

        updateServiceFields();

    });

});


/* =========================================
   تحديث الحقول حسب الخدمة
========================================= */

function updateServiceFields() {

    /*
       الرقم السري يظهر فقط مع جوال بي
    */

    if (selectedService === "jawwal") {

        showElement(passwordGroup);

    } else {

        hideElement(passwordGroup);

        if (passwordInput) {
            passwordInput.value = "";
        }
    }


    /*
       بنك فلسطين:
       مباشر بدون رقم المستلم والمبلغ والملاحظات
    */

    if (selectedService === "bank") {

        hideElement(receiverGroup);
        hideElement(amountGroup);
        hideElement(notesGroup);

        /*
           لا يوجد دفع لصديق/تاجر لبنك فلسطين
           إذا كان ظاهرًا يتم إلغاء الاختيار بصريًا
        */

        paymentButtons.forEach(button => {
            button.classList.remove("active");
        });

        selectedPayment = "";

    } else {

        showElement(receiverGroup);
        showElement(amountGroup);
        showElement(notesGroup);
    }

}


/* =========================================
   تنظيف الرقم
========================================= */

function cleanNumber(value) {

    return String(value || "")
        .trim()
        .replace(/\s+/g, "");

}


/* =========================================
   تنظيف المبلغ
========================================= */

function cleanAmount(value) {

    return String(value || "")
        .trim()
        .replace(/,/g, ".");

}


/* =========================================
   بناء كود جوال بي
========================================= */

function buildJawwalCode() {

    const password =
        cleanNumber(passwordInput.value);

    const receiver =
        cleanNumber(receiverInput.value);

    const amount =
        cleanAmount(amountInput.value);


    /*
       الدفع لصديق
       *110*1*الرقم السري*رقم المستلم*المبلغ#
    */

    if (selectedPayment === "friend") {

        return (
            "*110*1*" +
            password +
            "*" +
            receiver +
            "*" +
            amount +
            "#"
        );

    }


    /*
       الدفع لتاجر
       *110*2*الرقم السري*رقم المستلم*المبلغ#
    */

    if (selectedPayment === "merchant") {

        return (
            "*110*2*" +
            password +
            "*" +
            receiver +
            "*" +
            amount +
            "#"
        );

    }


    return "";

}


/* =========================================
   بناء كود بال بي
========================================= */

function buildPalPayCode() {

    const receiver =
        cleanNumber(receiverInput.value);

    const amount =
        cleanAmount(amountInput.value);


    /*
       أبقينا كود بال بي منفصلًا
       حتى لا يتأثر بتعديل جوال بي.
    */

    return (
        "*600*" +
        receiver +
        "*" +
        amount +
        "#"
    );

}


/* =========================================
   بنك فلسطين
========================================= */

function buildBankCode() {

    /*
       التحويل عن طريق بنك فلسطين مباشر.
       لا نطلب رقم المستلم أو المبلغ أو الملاحظات.
    */

    return "";

}


/* =========================================
   إنشاء الكود
========================================= */

function createCode() {

    if (!selectedService) {

        alert("يرجى اختيار جهة التحويل أولاً.");

        return;
    }


    /*
       بنك فلسطين
    */

    if (selectedService === "bank") {

        currentUSSD = buildBankCode();

        resultMessage.textContent =
            "سيتم فتح الاتصال المباشر ببنك فلسطين.";

        ussdCode.textContent =
            "اتصال مباشر";

        pendingCallHref =
            "tel:";

        callButton.href =
            pendingCallHref;

        showElement(resultSection);

        openConfirmation();

        return;
    }


    /*
       لازم اختيار طريقة الدفع
    */

    if (!selectedPayment) {

        alert("يرجى اختيار طريقة الدفع.");

        return;
    }


    /*
       جوال بي يحتاج الرقم السري
    */

    if (selectedService === "jawwal") {

        const password =
            cleanNumber(passwordInput.value);

        if (!password) {

            alert("يرجى إدخال الرقم السري.");

            passwordInput.focus();

            return;
        }

    }


    const receiver =
        cleanNumber(receiverInput.value);

    const amount =
        cleanAmount(amountInput.value);


    if (!receiver) {

        alert("يرجى إدخال رقم المستلم.");

        receiverInput.focus();

        return;
    }


    if (!amount || Number(amount) <= 0) {

        alert("يرجى إدخال مبلغ صحيح.");

        amountInput.focus();

        return;
    }


    /*
       إنشاء الكود حسب الخدمة
    */

    if (selectedService === "jawwal") {

        currentUSSD =
            buildJawwalCode();

    } else if (selectedService === "palpay") {

        currentUSSD =
            buildPalPayCode();

    } else {

        currentUSSD = "";

    }


    if (!currentUSSD) {

        alert("تعذر إنشاء كود العملية.");

        return;
    }


    /*
       تحويل # إلى %23 داخل رابط tel
    */

    pendingCallHref =
        "tel:" +
        encodeURIComponent(currentUSSD);


    ussdCode.textContent =
        currentUSSD;

    resultMessage.textContent =
        "تم تجهيز كود العملية. اضغط تأكيد الاتصال.";

    callButton.href =
        pendingCallHref;


    showElement(resultSection);


    /*
       فتح نافذة التأكيد
    */

    openConfirmation();

}


/* =========================================
   زر إنشاء الكود
========================================= */

if (createButton) {

    createButton.addEventListener(
        "click",
        createCode
    );

}


/* =========================================
   نافذة تأكيد الاتصال
========================================= */

function openConfirmation() {

    if (!confirmModal) {
        return;
    }


    if (confirmService) {

        confirmService.textContent =
            serviceNames[selectedService] ||
            selectedService;

    }


    if (confirmPaymentRow) {

        if (selectedPayment) {

            showElement(confirmPaymentRow);

        } else {

            hideElement(confirmPaymentRow);

        }

    }


    if (confirmPayment) {

        confirmPayment.textContent =
            paymentNames[selectedPayment] ||
            "-";

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


    if (confirmReceiver) {
        confirmReceiver.textContent =
            receiver || "-";
    }


    if (confirmAmount) {

        confirmAmount.textContent =
            amount
                ? amount + " شيكل"
                : "-";

    }


    if (selectedService === "bank") {

        hideElement(confirmReceiverRow);
        hideElement(confirmAmountRow);

    } else {

        showElement(confirmReceiverRow);
        showElement(confirmAmountRow);

    }


    showElement(confirmModal);

}


/* =========================================
   إغلاق التأكيد
========================================= */

function closeConfirmation() {

    hideElement(confirmModal);

}


/* =========================================
   تأكيد الاتصال
========================================= */

if (confirmCallButton) {

    confirmCallButton.addEventListener(
        "click",
        () => {

            closeConfirmation();


            /*
               بنك فلسطين:
               اتصال مباشر بدون USSD
            */

            if (selectedService === "bank") {

                saveHistory();

                /*
                   لا نضع رقمًا أو مبلغًا
                   لبنك فلسطين.
                */

                window.location.href =
                    "tel:";

                return;
            }


            /*
               باقي الخدمات
            */

            if (pendingCallHref) {

                saveHistory();

                window.location.href =
                    pendingCallHref;

            }

        }
    );

}


/* =========================================
   إلغاء الاتصال
========================================= */

if (cancelCallButton) {

    cancelCallButton.addEventListener(
        "click",
        closeConfirmation
    );

}


/* الضغط على الخلفية لإغلاق النافذة */

const confirmOverlay =
    document.querySelector(
        ".confirm-overlay"
    );

if (confirmOverlay) {

    confirmOverlay.addEventListener(
        "click",
        closeConfirmation
    );

}


/* =========================================
   السجل
========================================= */

function getHistory() {

    try {

        const saved =
            localStorage.getItem(
                HISTORY_KEY
            );

        if (!saved) {
            return [];
        }

        const parsed =
            JSON.parse(saved);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        return [];

    }

}


/* =========================================
   حفظ السجل
========================================= */

function saveHistory() {

    const history =
        getHistory();


    const item = {

        id:
            Date.now(),

        service:
            selectedService,

        serviceName:
            serviceNames[selectedService] ||
            selectedService,

        payment:
            selectedPayment,

        paymentName:
            paymentNames[selectedPayment] ||
            "",

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

        date:
            new Date().toLocaleString(
                "ar-PS"
            )

    };


    history.unshift(item);


    /*
       نحتفظ بآخر 100 حركة
    */

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


/* =========================================
   عرض السجل
========================================= */

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

                            </span>

                        </span>


                        <span class="history-arrow">
                            ‹
                        </span>

                    </button>


                    <div class="history-content">

                        <div class="history-details">


                            <div class="history-detail-row">

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
                                <div class="history-detail-row">

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
                                <div class="history-detail-row">

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
                                <div class="history-detail-row">

                                    <span>
                                        المبلغ
                                    </span>

                                    <strong>
                                        ${escapeHTML(
                                            item.amount
                                        )} شيكل
                                    </strong>

                                </div>
                                `
                                : ""
                            }


                            ${
                                item.notes
                                ? `
                                <div class="history-detail-row">

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
                                <div class="history-code">
                                    ${escapeHTML(
                                        item.code
                                    )}
                                </div>
                                `
                                : ""
                            }


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


/* =========================================
   أحداث السجل
========================================= */

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
                            deleteButton.dataset.deleteId
                        );


                    deleteHistory(id);

                }
            );

        }

    });

}


/* =========================================
   حذف حركة
========================================= */

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


/* =========================================
   مسح السجل كاملًا
========================================= */

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


/* =========================================
   فتح وإغلاق قائمة السجل
========================================= */

if (historyToggle) {

    historyToggle.addEventListener(
        "click",
        () => {

            if (historyCard) {

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

        }
    );

}


/* =========================================
   الوضع الليلي
========================================= */

const THEME_KEY =
    "alkod_alwasit_theme";


function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            THEME_KEY
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark"
        );

        if (themeButton) {
            themeButton.textContent =
                "☀️";
        }

    } else {

        document.body.classList.remove(
            "dark"
        );

        if (themeButton) {
            themeButton.textContent =
                "🌙";
        }

    }

}


if (themeButton) {

    themeButton.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );


            const isDark =
                document.body.classList.contains(
                    "dark"
                );


            localStorage.setItem(
                THEME_KEY,
                isDark
                    ? "dark"
                    : "light"
            );


            themeButton.textContent =
                isDark
                    ? "☀️"
                    : "🌙";

        }
    );

}


/* =========================================
   حماية النصوص عند عرضها في HTML
========================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   إغلاق النافذة بزر Escape
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeConfirmation();

        }

    }
);


/* =========================================
   التشغيل الأول
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadTheme();

        renderHistory();

        updateServiceFields();

    }
);