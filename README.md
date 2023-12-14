# Image Prompter for Gradio
A gradio component to upload images and process point/box prompts.

This custom component is developed for [Tokenize Anything](https://github.com/baaivision/tokenize-anything) gradio demo.

## Installation

### Preliminaries

``gradio`` >= 4.0.0

### Installing Package

```bash
pip install gradio-image-prompter
```

## Quick Start

### Development

```bash
cd gradio-image-prompter
gradio cc install
gradio cc dev
```

### Example

```python
import gradio as gr
from gradio_image_prompter import ImagePrompter

demo = gr.Interface(
    lambda prompts: (prompts["image"], prompts["points"]),
    ImagePrompter(show_label=False),
    [gr.Image(show_label=False), gr.Dataframe(label="Points")],
)
demo.launch()

```

## License
[Apache License 2.0](LICENSE)

## Acknowledgement

We thank the repositories: [SAM](https://github.com/facebookresearch/segment-anything), [GradioBox](https://github.com/ShoufaChen/gradio-box) and [Gradio](https://github.com/gradio-app/gradio).
