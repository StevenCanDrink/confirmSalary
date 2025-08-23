import pyautogui
import time


def delete_version():
    # Move mouse to coordinates and click
    pyautogui.moveTo(3529, 119, duration=1)
    pyautogui.click()
    time.sleep(1)
    pyautogui.moveTo(3607, 233)  # Move relative
    pyautogui.click()
    time.sleep(1)
    pyautogui.moveTo(2587, 455)  # Move relative
    pyautogui.click()
    time.sleep(1)
    pyautogui.moveTo(3243, 371)  # Move relative
    pyautogui.click()
    time.sleep(1)
    pyautogui.moveTo(3202, 851)  # Move relative
    pyautogui.click()
    pyautogui.moveTo(3202, 851)  # Move relative
    pyautogui.click()
    time.sleep(1)
    pyautogui.moveTo(3529, 119, duration=1)
    pyautogui.click()
    time.sleep(2)
    pyautogui.press("f5")
    time.sleep(3)


for _ in range(200):
    delete_version()
