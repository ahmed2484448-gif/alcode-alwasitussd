/* ==================================================
   تطبيق الكود الوسيط
   script.js
================================================== */


/* ==================================================
   عناصر الصفحة
================================================== */

const serviceButtons =
    document.querySelectorAll(".service");

const paymentButtons =
    document.querySelectorAll(".payment-type");

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

const ussdCode =
    document.getElementById("ussdCode");

const resultMessage =
    document.getElementById("resultMessage");

const callButton =
    document.getElementById("callButton");

const historyContainer =
    document.getElementById("historyContainer");

const clearHistoryButton =
    document.getElementById("clearHistoryButton");

const themeButton =
    document.getElementById("themeButton");


/* ==================================================
   عناصر قائمة سجل الحركات
================================================== */

const historyToggle =
    document.getElementById("historyToggle");

const historyCard =
    document.querySelector(".history-card");


/* ==================================================
   عناصر نافذة التأكيد
================================================== */

const confirmModal =
    document.getElementById("confirmModal");

const confirmService =
    document.getElementById("confirmService");

const confirmPayment =
    document.getElementById("confirmPayment");

const confirmReceiver =
    document.getElementById("confirmReceiver");

const confirmAmount =
    document.getElementById("confirmAmount");

const confirmCallButton =
    document.getElementById("confirmCallButton");

const cancelCallButton =
    document.getElementById("cancelCallButton");


/* ==================================================
   المتغيرات
================================================== */

let selectedService = null;

let selectedPaymentType = null;

let currentUssdCode = "";


/* ==================================================
   أسماء الخدمات
================================================== */

const serviceNames = {

    jawwal: "جوال بي",

    palpay: "بال بي",

    bank: "بنك فلسطين"

};


/* ==================================================
   أسماء طرق الدفع
================================================== */

const paymentNames = {

    friend: "الدفع لصديق",

    merchant: "الدفع لتاجر"

};


/* ==================================================
   اختيار جهة الدفع
================================================== */

serviceButtons.forEach(button => {

    button.addEventListener("click", () => {

        serviceButtons.forEach(item => {

            item.classList.remove("active");

        });


        button.classList.add("active");


        selectedService =
            button.dataset.service;


        resultSection.classList.add(
            "hidden"
        );


        const paymentCard =
            document.querySelector(
                ".payment-card"
            );


        /*
         * بنك فلسطين لا يحتاج
         * إلى اختيار صديق أو تاجر
         */

        if (selectedService === "bank") {

            if (paymentCard) {

                paymentCard.classList.add(
                    "hidden"
                );

            }


            paymentButtons.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


            selectedPaymentType = null;

        }


        /*
         * جوال بي / بال بي
         */

        else {

            if (paymentCard) {

                paymentCard.classList.remove(
                    "hidden"
                );

            }

        }

    });

});


/* ==================================================
   اختيار طريقة الدفع
================================================== */

paymentButtons.forEach(button => {

    button.addEventListener("click", () => {

        paymentButtons.forEach(item => {

            item.classList.remove("active");

        });


        button.classList.add("active");


        selectedPaymentType =
            button.dataset.type;

    });

});


/* ==================================================
   إنشاء الكود
================================================== */

createButton.addEventListener("click", () => {


    /* ----------------------------------------------
       التأكد من اختيار الخدمة
    ---------------------------------------------- */

    if (!selectedService) {

        alert(
            "يرجى اختيار جهة الدفع أولاً."
        );

        return;

    }


    /* ==============================================
       بنك فلسطين
    ============================================== */

    if (selectedService === "bank") {

        const code =
            "*267#";


        currentUssdCode =
            code;


        showResult(

            code,

            "كود بنك فلسطين جاهز للتنفيذ."

        );


        saveHistory({

            service:
                "بنك فلسطين",

            payment:
                "تحويل بنك فلسطين",

            receiver:
                "-",

            amount:
                "-",

            notes:
                notesInput.value.trim(),

            code:
                code

        });


        return;

    }


    /* ----------------------------------------------
       التأكد من طريقة الدفع
    ---------------------------------------------- */

    if (!selectedPaymentType) {

        alert(
            "يرجى اختيار طريقة الدفع."
        );

        return;

    }


    const receiver =
        receiverInput.value.trim();

    const amount =
        amountInput.value.trim();

    const notes =
        notesInput.value.trim();


    /* ----------------------------------------------
       التحقق من رقم المستلم
    ---------------------------------------------- */

    if (!receiver) {

        alert(
            "يرجى إدخال رقم المستلم."
        );

        receiverInput.focus();

        return;

    }


    const cleanReceiver =
        receiver.replace(/\s/g, "");


    if (!/^\d+$/.test(cleanReceiver)) {

        alert(
            "رقم المستلم يجب أن يحتوي على أرقام فقط."
        );

        receiverInput.focus();

        return;

    }


    if (
        cleanReceiver.length < 9 ||
        cleanReceiver.length > 10
    ) {

        alert(
            "يرجى إدخال رقم مستلم صحيح."
        );

        receiverInput.focus();

        return;

    }


    /* ----------------------------------------------
       التحقق من المبلغ
    ---------------------------------------------- */

    if (!amount) {

        alert(
            "يرجى إدخال المبلغ."
        );

        amountInput.focus();

        return;

    }


    const numericAmount =
        Number(amount);


    if (!Number.isFinite(numericAmount)) {

        alert(
            "المبلغ غير صحيح."
        );

        amountInput.focus();

        return;

    }


    if (numericAmount <= 0) {

        alert(
            "المبلغ يجب أن يكون أكبر من صفر."
        );

        amountInput.focus();

        return;

    }


    if (
        !Number.isInteger(
            numericAmount * 100
        )
    ) {

        alert(
            "المبلغ يمكن أن يحتوي على خانتين عشريتين كحد أقصى."
        );

        amountInput.focus();

        return;

    }


    /* ==============================================
       إنشاء كود USSD
    ============================================== */

    let code = "";


    /* ----------------------------------------------
       جوال بي
    ---------------------------------------------- */

    if (selectedService === "jawwal") {

        if (
            selectedPaymentType === "friend"
        ) {

            code =
                `*110*1*${cleanReceiver}*${numericAmount}#`;

        }

        else if (
            selectedPaymentType === "merchant"
        ) {

            code =
                `*110*2*${cleanReceiver}*${numericAmount}#`;

        }

    }


    /* ----------------------------------------------
       بال بي
    ---------------------------------------------- */

    else if (selectedService === "palpay") {

        if (
            selectedPaymentType === "friend"
        ) {

            code =
                `*370*1*1*${cleanReceiver}*${numericAmount}#`;

        }

        else if (
            selectedPaymentType === "merchant"
        ) {

            code =
                `*370*1*2*${cleanReceiver}*${numericAmount}#`;

        }

    }


    /* ----------------------------------------------
       التأكد من إنشاء الكود
    ---------------------------------------------- */

    if (!code) {

        alert(
            "تعذر إنشاء الكود، يرجى التأكد من البيانات."
        );

        return;

    }


    currentUssdCode =
        code;


    /* ----------------------------------------------
       عرض النتيجة
    ---------------------------------------------- */

    showResult(

        code,

        `كود ${serviceNames[selectedService]} جاهز للتنفيذ.`

    );


    /* ----------------------------------------------
       حفظ الحركة
    ---------------------------------------------- */

    saveHistory({

        service:
            serviceNames[selectedService],

        payment:
            paymentNames[selectedPaymentType],

        receiver:
            cleanReceiver,

        amount:
            numericAmount,

        notes:
            notes,

        code:
            code

    });

});


/* ==================================================
   عرض نتيجة العملية
================================================== */

function showResult(code, message) {

    ussdCode.textContent =
        code;


    resultMessage.textContent =
        message;


    callButton.removeAttribute(
        "href"
    );


    callButton.href =
        "#";


    resultSection.classList.remove(
        "hidden"
    );


    setTimeout(() => {

        resultSection.scrollIntoView({

            behavior:
                "smooth",

            block:
                "center"

        });

    }, 100);

}


/* ==================================================
   فتح وإغلاق سجل الحركات
   القائمة الرئيسية الواحدة
================================================== */

if (historyToggle) {

    historyToggle.addEventListener(
        "click",
        () => {

            if (!historyCard) {

                return;

            }


            const isOpen =
                historyCard.classList.contains(
                    "open"
                );


            if (isOpen) {

                historyCard.classList.remove(
                    "open"
                );


                historyToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

            else {

                historyCard.classList.add(
                    "open"
                );


                historyToggle.setAttribute(
                    "aria-expanded",
                    "true"
                );

            }

        }
    );

}


/* ==================================================
   الضغط على زر تأكيد الاتصال
================================================== */

callButton.addEventListener(
    "click",
    event => {

        event.preventDefault();


        openConfirmModal();

    }
);


/* ==================================================
   فتح نافذة التأكيد
================================================== */

function openConfirmModal() {

    if (!confirmModal) {

        return;

    }


    confirmService.textContent =
        serviceNames[selectedService] ||
        "-";


    if (selectedService === "bank") {

        confirmPayment.textContent =
            "تحويل بنك فلسطين";

    }

    else {

        confirmPayment.textContent =
            paymentNames[selectedPaymentType] ||
            "-";

    }


    confirmReceiver.textContent =
        receiverInput.value.trim() ||
        "-";


    if (selectedService === "bank") {

        confirmAmount.textContent =
            "غير مطلوب";

    }

    else {

        const amount =
            amountInput.value.trim();


        confirmAmount.textContent =
            amount
                ? `${amount} شيكل`
                : "-";

    }


    confirmModal.classList.remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";

}


/* ==================================================
   إغلاق نافذة التأكيد
================================================== */

function closeConfirmModal() {

    if (!confirmModal) {

        return;

    }


    confirmModal.classList.add(
        "hidden"
    );


    document.body.style.overflow =
        "";

}


/* ==================================================
   إلغاء الاتصال
================================================== */

cancelCallButton.addEventListener(
    "click",
    () => {

        closeConfirmModal();

    }
);


/* ==================================================
   الضغط على خلفية النافذة
================================================== */

const confirmOverlay =
    document.querySelector(
        ".confirm-overlay"
    );


if (confirmOverlay) {

    confirmOverlay.addEventListener(
        "click",
        () => {

            closeConfirmModal();

        }
    );

}


/* ==================================================
   تأكيد الاتصال فعليًا
================================================== */

confirmCallButton.addEventListener(
    "click",
    () => {

        if (!currentUssdCode) {

            closeConfirmModal();

            return;

        }


        closeConfirmModal();


        const telLink =
            `tel:${encodeURIComponent(
                currentUssdCode
            )}`;


        window.location.href =
            telLink;

    }
);


/* ==================================================
   زر Escape
================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            confirmModal &&
            !confirmModal.classList.contains(
                "hidden"
            )
        ) {

            closeConfirmModal();

        }

    }
);


/* ==================================================
   جلب سجل الحركات
================================================== */

function getHistory() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "alcode_history"
                )
            );


        if (!Array.isArray(saved)) {

            return [];

        }


        return saved;

    }

    catch (error) {

        return [];

    }

}


/* ==================================================
   حفظ حركة
================================================== */

function saveHistory(operation) {

    const history =
        getHistory();


    const item = {

        ...operation,

        id:
            Date.now() +
            Math.random()
                .toString(16)
                .slice(2),

        date:
            new Date().toLocaleString(
                "ar-PS"
            )

    };


    history.unshift(item);


    const limitedHistory =
        history.slice(0, 50);


    localStorage.setItem(

        "alcode_history",

        JSON.stringify(
            limitedHistory
        )

    );


    renderHistory();

}


/* ==================================================
   عرض جميع الحركات داخل القائمة الواحدة
================================================== */

function renderHistory() {

    const history =
        getHistory();


    if (!history.length) {

        historyContainer.innerHTML = `

            <div class="empty-history">

                لا توجد عمليات حتى الآن

            </div>

        `;

        return;

    }


    historyContainer.innerHTML =
        "";


    history.forEach((item, index) => {

        const historyItem =
            document.createElement(
                "div"
            );


        historyItem.className =
            "history-item";


        const amountText =
            item.amount !== "-"
                ? `${escapeHTML(item.amount)} شيكل`
                : "-";


        historyItem.innerHTML = `

            <button
                class="history-summary"
                type="button"
                aria-expanded="false"
            >

                <span class="history-summary-info">

                    <span class="history-number">

                        ${index + 1}

                    </span>


                    <span class="history-summary-text">

                        <strong>

                            ${escapeHTML(
                                item.service
                            )}

                        </strong>


                        <small>

                            ${escapeHTML(
                                amountText
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
                            نوع العملية
                        </span>

                        <strong>
                            ${escapeHTML(
                                item.payment
                            )}
                        </strong>

                    </div>


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


                    <div class="history-detail-row">

                        <span>
                            المبلغ
                        </span>

                        <strong>
                            ${escapeHTML(
                                amountText
                            )}
                        </strong>

                    </div>


                    ${
                        item.notes
                            ? `

                                <div class="history-detail-row">

                                    <span>
                                        ملاحظات
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


                    <div class="history-detail-row">

                        <span>
                            التاريخ
                        </span>

                        <strong>
                            ${escapeHTML(
                                item.date
                            )}
                        </strong>

                    </div>


                    <div class="history-code">

                        ${escapeHTML(
                            item.code
                        )}

                    </div>


                    <button
                        class="delete-history-button"
                        data-id="${item.id}"
                        type="button"
                    >

                        🗑️ حذف الحركة

                    </button>


                </div>

            </div>

        `;


        historyContainer.appendChild(
            historyItem
        );

    });


    /* ==================================================
       فتح تفاصيل الحركة
    ================================================== */

    document
        .querySelectorAll(
            ".history-summary"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const item =
                        button.closest(
                            ".history-item"
                        );


                    const isOpen =
                        item.classList.contains(
                            "open"
                        );


                    /*
                     * إغلاق باقي الحركات
                     */

                    document
                        .querySelectorAll(
                            ".history-item.open"
                        )
                        .forEach(openItem => {

                            openItem.classList.remove(
                                "open"
                            );


                            const openButton =
                                openItem.querySelector(
                                    ".history-summary"
                                );


                            if (openButton) {

                                openButton.setAttribute(
                                    "aria-expanded",
                                    "false"
                                );

                            }

                        });


                    /*
                     * فتح الحركة المطلوبة
                     */

                    if (!isOpen) {

                        item.classList.add(
                            "open"
                        );


                        button.setAttribute(
                            "aria-expanded",
                            "true"
                        );

                    }

                }
            );

        });


    /* ==================================================
       أزرار حذف الحركات
    ================================================== */

    document
        .querySelectorAll(
            ".delete-history-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    const id =
                        button.dataset.id;


                    deleteHistoryItem(id);

                }
            );

        });

}


/* ==================================================
   حذف حركة واحدة
================================================== */

function deleteHistoryItem(id) {

    const history =
        getHistory();


    const confirmed =
        confirm(
            "هل تريد حذف هذه الحركة؟"
        );


    if (!confirmed) {

        return;

    }


    const newHistory =
        history.filter(
            item =>
                String(item.id) !==
                String(id)
        );


    localStorage.setItem(

        "alcode_history",

        JSON.stringify(
            newHistory
        )

    );


    renderHistory();

}


/* ==================================================
   حماية النصوص
================================================== */

function escapeHTML(value) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";

    }


    return String(value)

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
   مسح السجل بالكامل
================================================== */

clearHistoryButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        const history =
            getHistory();


        if (!history.length) {

            return;

        }


        const confirmed =
            confirm(
                "هل أنت متأكد من مسح سجل الحركات بالكامل؟"
            );


        if (!confirmed) {

            return;

        }


        localStorage.removeItem(
            "alcode_history"
        );


        renderHistory();

    }
);


/* ==================================================
   الوضع المظلم والفاتح
================================================== */

function updateThemeButton() {

    if (
        document.body.classList.contains(
            "dark"
        )
    ) {

        themeButton.textContent =
            "☀️";

    }

    else {

        themeButton.textContent =
            "🌙";

    }

}


/* ==================================================
   تغيير الوضع
================================================== */

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

            "alcode_theme",

            isDark
                ? "dark"
                : "light"

        );


        updateThemeButton();

    }
);


/* ==================================================
   تحميل الوضع
================================================== */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "alcode_theme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark"
        );

    }


    updateThemeButton();

}


/* ==================================================
   تشغيل التطبيق
================================================== */

loadTheme();

renderHistory();