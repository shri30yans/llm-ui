def func():
    return a+b
    
    
class Car:
    def __init__(self, brand, model):
        self.brand = brand
        self.model = model
        
    def show(self):
        print(self.brand, self.model)

Car
Car("Toyota", "Corolla")

func(Car("Toyota", "Corolla"))
func(A)