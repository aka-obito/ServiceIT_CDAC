package com.serviceit.auth.constants;

public final class ValidationConstants {

    private ValidationConstants() {}

    public static final String PHONE_REGEX = "^[6-9]\\d{9}$";
    public static final String PINCODE_REGEX = "^[1-9][0-9]{5}$";
    public static final String PASSWORD_REGEX =
            "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$";
}
