import datetime
import tkinter as tk
from tkinter import messagebox
from PIL import Image, ImageTk

def verificar():
    try:
        ano = int(entrada_ano.get())
        atual = datetime.datetime.now().year
        idade = atual - ano

        # Determinar sexo
        if var_sexo.get() == 1:
            sexo = 'masculino'
        elif var_sexo.get() == 2:
            sexo = 'feminino'
        else:
            messagebox.showerror("Erro", "Selecione o sexo.")
            return

        if idade <= 15:
            img_path = f"crianca_{sexo}.png"
        elif 18 < idade <= 40:
            img_path = f"jovem_{sexo}.jpg"
        elif 50 < idade <= 60:
            img_path = f"idoso_{sexo}.jpg"
        else:
            messagebox.showinfo("Sem imagem", f"Idade {idade} anos não corresponde a nenhuma faixa com imagem.")
            return

        # Mostrar imagem
        img = Image.open(img_path)
        img = img.resize((200, 200))
        foto = ImageTk.PhotoImage(img)
        painel.config(image=foto)
        painel.image = foto

    except ValueError:
        messagebox.showerror("Erro", "Digite um ano válido!")

# Interface
janela = tk.Tk()
janela.title("Detector de Faixa Etária")
janela.geometry("400x450")
janela.configure(bg="#f0f0f0")

# Frame para conteúdo centralizado
frame = tk.Frame(janela, bg="#f0f0f0")
frame.pack(pady=20)

# Entrada de ano
tk.Label(frame, text="Ano de Nascimento:", bg="#f0f0f0", font=("Arial", 12)).pack()
entrada_ano = tk.Entry(frame, font=("Arial", 12))
entrada_ano.pack(pady=5)

# Seleção de sexo
tk.Label(frame, text="Sexo:", bg="#f0f0f0", font=("Arial", 12)).pack(pady=(10, 0))
var_sexo = tk.IntVar()

frame_sexo = tk.Frame(frame, bg="#f0f0f0")
frame_sexo.pack()
tk.Radiobutton(frame_sexo, text="Masculino", variable=var_sexo, value=1, bg="#f0f0f0", font=("Arial", 11)).pack(side=tk.LEFT, padx=10)
tk.Radiobutton(frame_sexo, text="Feminino", variable=var_sexo, value=2, bg="#f0f0f0", font=("Arial", 11)).pack(side=tk.LEFT, padx=10)

# Botão de verificação
tk.Button(frame, text="Verificar", command=verificar, font=("Arial", 12), bg="#007acc", fg="white").pack(pady=20)

# Painel de imagem
painel = tk.Label(janela, bg="#f0f0f0")
painel.pack()

janela.mainloop()
