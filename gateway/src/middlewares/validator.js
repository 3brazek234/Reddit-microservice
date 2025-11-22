// src/middlewares/validator.js

/**
 * middleware للتحقق من البيانات باستخدام Joi schema.
 * @param {Object} schema - الـ Joi schema المستخدمة للتحقق.
 * @param {string} source - مكان البيانات في الـ request (مثلاً 'body', 'query', 'params'). الافتراضي 'body'.
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    // بنختار البيانات اللي هنتحقق منها بناءً على الـ source (body, query, or params)
    const dataToValidate = req[source];

    // تنفيذ عملية التحقق
    // abortEarly: false بيخليه يرجع كل الأخطاء مش أول واحد بس
    const { error, value } = schema.validate(dataToValidate, { abortEarly: false });

    if (error) {
      // لو فيه أخطاء، بنجمع رسايل الخطأ كلها في مصفوفة
      const errorMessages = error.details.map((detail) => detail.message);

      console.log("Validation Error:", errorMessages);

      // بنرجع استجابة 400 Bad Request مع قائمة الأخطاء
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errorMessages
      });
    }

    req[source] = value;

    next();
  };
};

module.exports = validate;