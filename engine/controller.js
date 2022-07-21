let Controller2048 = class {
    constructor(model, view) {
        this.model = model;
        this.view = view;


        view.addListener((e) => {
            switch (e.keyCode) {
                case 37:
                    this.model.move("left");
                break;
                case 38:
                    this.model.move("up");
                break;
                case 39:
                    this.model.move("right");
                break;
                case 40:
                    this.model.move("down");
                break;
            }
        });
    }
}

export default Controller2048;