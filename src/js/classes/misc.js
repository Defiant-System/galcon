
class Matrix {
	constructor(a, b, c, d, tx, ty) {
		this._a = a;
		this._b = b;
		this._c = c;
		this._d = d;
		this._tx = tx;
		this._ty = ty;

		this._rotation = 0;
		this._scaleX = 1;
		this._scaleY = 1;
	}

	identity() {
		this._a = 1;
		this._b = 0;
		this._c = 0;
		this._d = 1;
		this._tx = 0;
		this._ty = 0;

		this._rotation = 0;
		this._scaleX = 1;
		this._scaleY = 1;

		return this;
	}

	clone() {
		return new Matrix(this._a, this._b, this._c, this._d, this._tx, this._ty);
	}

	equals(mx) {
		return mx === this || mx && this._a === mx._a && this._b === mx._b
                && this._c === mx._c && this._d === mx._d
                && this._tx === mx._tx && this._ty === mx._ty;
	}

	toString() {
		return `[
			[${[this._a, this._c, this._tx].join(",")}],
			[${[this._b, this._d, this._ty].join(",")}]
		]`;
	}

	inverse() {
		var myDeterminant = this._a * this._d - this._b * this._c;
		var myA = this._d / myDeterminant,
        	myB = -this._b / myDeterminant,
			myC = -this._c / myDeterminant,
			myD = this._a / myDeterminant,
			myTx = (this._c * this._ty - this._d * this._tx) / myDeterminant,
			myTy = (this._b * this._tx - this._a * this._ty) / myDeterminant;

		this._a = myA;
		this._b = myB;
		this._c = myC;
		this._d = myD;
		this._tx = myTx;
		this._ty = myTy;

		return this;
	}

	multiply(mx) {
		this.multiply2(mx._a, mx._b, mx._c, mx._d, mx._tx, mx._ty);

		this._scaleX *= mx._scaleX;
		this._scaleY *= mx._scaleY;
		this._rotation += mx._rotation;

		return this;
	}

	multiply2(a, b, c, d, tx, ty) {
		var myA = this._a * a + this._c * b,
        	myB = this._b * a + this._d * b,
			myC = this._a * c + this._c * d,
			myD = this._b * c + this._d * d,
			myTx = this._a * tx + this._c * ty + this._tx,
			myTy = this._b * tx + this._d * ty + this._ty;

		this._a = myA;
		this._b = myB;
		this._c = myC;
		this._d = myD;
		this._tx = myTx;
		this._ty = myTy;

		return this;
	}

	rotate(rotation) {
		var mySine = Math.sin(rotation),
			myCosine = Math.cos(rotation);

		this.multiply2(myCosine, mySine, -mySine, myCosine, 1, 1);
		this._rotation = rotation;

		return this;
	}

	scale(scaleX, scaleY) {
		this.multiply2(scaleX, 0, 0, scaleY, 1, 1);

		this._scaleX = scaleX;
		this._scaleY = scaleY;

		return this;
	}

	translate(x, y) {
		this.multiply2(1, 0, 0, 1, x, y);
		return this;
	}

	copy(mx) {
		this._a = mx._a;
		this._b = mx._b;
		this._c = mx._c;
		this._d = mx._d;

		this._tx = mx._tx;
		this._ty = mx._ty;
		return this;
	}
}


class Rectangle {
	constructor(x, y, width, height) {
		this._topLeft = new Point(x, y);
		this._size = new Size(width, height);
	}

	get x() { return this._topLeft._x; }
	get y() { return this._topLeft._y; }
	get left() { return this._topLeft._x; }
	get top() { return this._topLeft._y; }
	get width() { return this._size._width; }
	get height() { return this._size._height; }

	set x(value) { this._topLeft._x = value; }
	set y(value) { this._topLeft._y = value; }
	set width(value) { this._size.width = value; }
	set height(value) { this._size.height = value; }

	center() {
		this._topLeft._x = -this._size.width >> 1;
		this._topLeft._y = -this._size.height >> 1;

		return this;
	}

	contains(point) {
		var myHorizontal = point._x > this.left && point._x < this.right;
		var myVertical = point.y > this.top && point.y < this.bottom;

		return myHorizontal && myVertical;
	}

	union(rectangle) {
		this._topLeft._x = Math.min(this._topLeft._x, rectangle._topLeft._x);
		this._topLeft._y = Math.min(this._topLeft._y, rectangle._topLeft._y);
		
		var myRight = Math.max(this.right, rectangle.right);
		this.size.width = myRight - this._topLeft._x;

		var myBottom = Math.max(this.right, rectangle.right);
		this.size.height = myRight - this._topLeft._y;

		return this;
	}

	inflate(size) {
		this._topLeft._x -= size.width;
		this._topLeft._y -= size.height;

		this._size.width += size.width * 2;
		this._size.height += size.height * 2;
			return this;
	}

	deflate(size) {
		this._topLeft._x += size.width;
		this._topLeft._y += size.height;

		this._size.width -= size.width * 2;
		this._size.height -= size.height * 2;

		return this;
	}

	translate(x, y) {
		this._topLeft._x += x;
		this._topLeft._y += y;

		return this;
	}

	intersects(rectangle) {
		return !(rectangle.left > this.right || 
       			 rectangle.right < this.left || 
       			 rectangle.top > this.bottom ||
       			 rectangle.bottom < this.top);			
	}

	empty() {
		this._topLeft.empty();
		this._size.empty();
		return this;
	}

	clone() {
		return new Rectangle(this._topLeft._x, this._topLeft._y, this._size.width, this._size.height);
	}

	copy(rectangle) {
		this._topLeft._x = rectangle.left;
		this._topLeft._y = rectangle.top;
		this._size.width = rectangle.size.width;
		this._size.height = rectangle.size.height;
		return this;
	}
}


class Size {
	constructor(width, height) {
		this.width = width || 0;
		this.height = height || 0;
	}

	empty() {
		this.width = 0;
		this.height = 0;
		return this;
	}

	clone() {
		return new Size(this.width, this.height);
	}

	copy(size) {
		this.width = size.width;
		this.height = size.height;
		return this;
	}
}


class Point {
	constructor(x, y) {
		this._x = x;
		this._y = y;
	}

	distance(point) {
		var myX = this._x - point._x;
        var myY = this._y - point._y;
        return Math.sqrt(myX * myX + myY * myY);			
	}

	direction(point) {
		var myX = point ? point._x - this._x : this._x,
			myY = point ? point._y - this._y : this._y;
   		return Math.atan2(myY, myX);
	}

	moveTowards(point, step) {
		let angle = this.direction(point);
		this._x += Math.cos(angle) * step;
		this._y += Math.sin(angle) * step;
		return this;
	}

	abs() {
		this._x = Math.abs(this._x);
		this._y = Math.abs(this._y);
		return this;
	}

	normalize(thickness) { 
		var length = Math.sqrt(this._x * this._x + this._y * this._y),
			myInversed = 1 / length;
		this._x *= myInversed,
		this._y *= myInversed;
		return this;
	}

	add(point) {
		return new Point(this._x + point._x, this._y + point._y);
	}

	subtract(point) {
		return new Point(this._x - point._x, this._y - point._y);
	}

	multiply(value) {
		return new Point(this._x * value, this._y * value);
	}

	divide(value) {
		return new Point(this._x / value, this._y / value);
	}

	empty() {
		this._x = 0;
		this._y = 0;
		return this;
	}

	clone() {
		return new Point(this._x, this._y);
	}

	copy(point) {
		this._x = point._x;
		this._y = point._y;

		return this;
	}
}
