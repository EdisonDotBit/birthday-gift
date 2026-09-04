# Birthday Surprise Web App ♡

A vanilla HTML/CSS/JavaScript interactive birthday experience.

## Folder structure

birthday-crush-site/
├── index.html
├── style.css
├── script.js
├── images/
│   └── birthday-drawing.svg
└── audio/
    └── sleepless-jasmine.mp3

## How to run

You can double-click index.html for most of the experience.

For microphone/cake blowing, a local web server is recommended because
some browsers restrict microphone access on file:// pages.

If you have VS Code, the easiest option is the Live Server extension.

Or, if Python is installed:

    python -m http.server 5500

Then open:

    http://localhost:5500

## Add your drawing

Replace:

    images/birthday-drawing.svg

with your own image.

If you want to use a PNG/JPG instead, edit this line in index.html:

    <img id="drawingImage" src="images/birthday-drawing.svg" alt="A birthday drawing">

For example:

    <img id="drawingImage" src="images/my-drawing.png" alt="A birthday drawing">

## Add Sleepless Jasmine

Put your legally obtained/local audio file here:

    audio/sleepless-jasmine.mp3

The website starts the music after the first envelope click.

Important: browsers generally block websites from autoplaying audio before
the visitor interacts with the page.

## Customize the messages

All birthday messages are inside index.html.

Look for:

    <article class="page" ...>

There are currently five pages.

## Customize microphone sensitivity

In script.js:

    const BLOW_THRESHOLD = 0.23;

Lower number = easier to trigger.
Higher number = harder to trigger.

If the flame goes out too easily, try 0.30.

If it is difficult to blow out, try 0.18.

The cake also has a manual "Blow it out" fallback if microphone access
is unavailable.

## Compatibility

Designed for:
- Desktop/laptop
- Android phones
- iPhone/iPad
- Mouse and touchscreen

No framework or external JavaScript library is required.
