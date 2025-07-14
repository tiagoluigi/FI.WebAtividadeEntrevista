
$(document).ready(function () {
    $('#btnBeneficiarios').on('click', ModalBeneficiarios)
    $(document).off('change', '#CPFBeneficiario').on('change', '#CPFBeneficiario', function () {
        const valor = $(this).val(); // agora 'this' funciona como esperado
        if (!validarCPF(valor)) {
            ModalDialog("Erro", "CPF inválido: " + valor);
            $(this).val('')
        }
    });

       $('#formCadastro').submit(function (e) {
        const dados = {
            NOME: $("#Nome").val(),
            CEP: $("#CEP").val(),
            Email: $("#Email").val(),
            Sobrenome: $("#Sobrenome").val(),
            Nacionalidade: $("#Nacionalidade").val(),
            Estado: $("#Estado").val(),
            Cidade: $("#Cidade").val(),
            Logradouro: $("#Logradouro").val(),
            Telefone: $("#Telefone").val(),
            CPF: $("#CPF").val(),
            Beneficiarios: ObterRegistros() // já é um array de objetos
        };
        e.preventDefault();
        $.ajax({
            url: urlPost,
            method: "POST",            
            contentType: "application/json",
            data: JSON.stringify(dados),
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();
            }
        });
        })   
})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

function ModalBeneficiarios() {
    if ($('#ModalBeneficiarios').length > 0) {
        $('#ModalBeneficiarios').modal('show');
        return;
    }
    const $modal = $('<div>')
        .attr('id', 'ModalBeneficiarios')
        .addClass('modal fade');

    const $modalDialog = $('<div>').addClass('modal-dialog');
    const $modalContent = $('<div>').addClass('modal-content');

    const $modalHeader = $('<div>').addClass('modal-header');
    const $botaoClose = $('<button>')
        .attr('type', 'button')
        .addClass('close')
        .attr('data-dismiss', 'modal')
        .attr('aria-hidden', 'true')
        .html('&times;');

    const $titulo = $('<h4>').addClass('modal-title').text('Beneficiários');
    $modalHeader.append($botaoClose, $titulo);

    const $modalBody = $('<div>').addClass('modal-body');
    const $linha = $('<div>').addClass("row");

    const $colunaCPF = $('<div>').addClass("col-md-4");
    const $labelCPF = $('<label>').attr('for', 'CPF').text('CPF:');
    const $inputCPF = $('<input>')
        .attr('type', 'text')
        .attr('id', 'CPFBeneficiario')
        .attr('placeholder', 'Ex: 010.011.111-00')
        .addClass('form-control CPF')
        .mask("000.000.000-00");

    const $colunaNome = $('<div>').addClass("col-md-5");
    const $labelNome = $('<label>').attr('for', 'Nome').text('Nome:');
    const $inputNome = $('<input>')
        .attr('type', 'text')
        .attr('id', 'NomeBeneficiario')
        .attr('placeholder', 'Ex: Maria')
        .addClass('form-control');

    const $colunaBotao = $('<div>').addClass("col-md-3 d-flex align-items-end");    
    const $labelBotao = $('<br>')
    const $botaoIncluir = $('<button>').addClass("btn btn-success w-100").attr('id', 'IncluirBeneficiario').text('Incluir')

    const $Grid = $('<div>').attr('id', 'Grid')


    $colunaCPF.append($labelCPF).append($inputCPF)
    $colunaNome.append($labelNome).append($inputNome)
    $colunaBotao.append($labelBotao).append($botaoIncluir)

    $linha.append($colunaCPF).append($colunaNome).append($colunaBotao)
    $modalBody.append($linha).append($Grid)

    $modalContent.append($modalHeader, $modalBody);
    $modalDialog.append($modalContent);
    $modal.append($modalDialog);

    $('body').append($modal);
    MontarGrid();
    AdicionarBeneficiario();
    $('#ModalBeneficiarios').modal('show');    
}
var idEmEdicao = null;

function MontarGrid() {
    $('#Grid').jtable({
        fields: {
            IDBeneficiario: {
                key: true,
                list: false // 🔒 Oculta o campo ID na tabela
            },
            CPFBeneficiario: {
                title: 'CPF',
                width: '30%'
            },
            NomeBeneficiario: {
                title: 'Nome',
                width: '40%'
            },
            acoes: {
                title: 'Ações',
                sorting: false,
                width: '30%',
                display: function (data) {
                    const $btnEditar = $('<button>')
                        .text('Alterar')
                        .addClass('btn btn-primary btn-sm')
                        .click(function () {
                            // Preenche os inputs com os valores da linha
                            $('#CPFBeneficiario').val(data.record.CPFBeneficiario);
                            $('#NomeBeneficiario').val(data.record.NomeBeneficiario);

                            // Define o id da linha em edição
                            idEmEdicao = data.record.IDBeneficiario;

                            // Altera o botão para modo edição
                            $('#IncluirBeneficiario')
                                .text('Alterar')
                        });


                    const $btnExcluir = $('<button>')
                        .text('Excluir')
                        .addClass('btn btn-primary btn-sm')
                        .css('margin-left', '5px')
                        .click(function () {
                            $('#Grid').jtable('deleteRecord', {
                                clientOnly: true,
                                key: data.record.IDBeneficiario
                            });
                        });

                    return $('<div>').append($btnEditar).append($btnExcluir);
                }
            }
        }
    });  
    
    $('table').removeClass('jtable').addClass('table');   
}

function AdicionarBeneficiario() {
    $('#IncluirBeneficiario').off('click').click(function () {
        const cpf = $('#CPFBeneficiario').val().trim();
        const nome = $('#NomeBeneficiario').val().trim();

        if (!cpf || !nome) {
            alert('Preencha CPF e Nome.');
            return;
        }

        if (idEmEdicao) {
            // Modo edição: atualizar a linha
            $('#Grid').jtable('updateRecord', {
                clientOnly: true,
                record: {
                    IDBeneficiario: idEmEdicao,
                    CPFBeneficiario: cpf,
                    NomeBeneficiario: nome
                }
            });

            // Reseta o modo edição
            idEmEdicao = null;
            $(this)
                .text('Incluir')
                .removeClass('btn-primary')
                .addClass('btn-success');
        } else {
            // Modo inclusão
            const novoId = criarSequencial()
            if (!cpfExisteNoGrid(cpf)) {
                $('#Grid').jtable('addRecord', {
                    clientOnly: true,
                    record: {
                        IDBeneficiario: novoId,
                        CPFBeneficiario: cpf,
                        NomeBeneficiario: nome

                    }
                });
            }
            else {
                ModalDialog('Erro', 'CPF já foi inserido')
            }
        }

        // Limpa os campos
        $('#CPFBeneficiario').val('');
        $('#NomeBeneficiario').val('');
        $('table').removeClass('jtable').addClass('table');
       
    });

}



function ObterRegistros() {
    const registros = [];

    $('#Grid .jtable-data-row').each(function () {
        const dados = $(this).data('record');
        if (dados && dados.CPFBeneficiario && dados.NomeBeneficiario) {
            registros.push({
                CPFBeneficiario: dados.CPFBeneficiario,
                NomeBeneficiario: dados.NomeBeneficiario
            });
        }
    });

    return registros;
}
function criarSequencial(inicio = 1) {
    let contador = inicio;
    return function () {
        return contador++;
    };
}
function cpfExisteNoGrid(cpf) {
    let existe = false;

    $('#Grid .jtable-data-row').each(function () {
        const registro = $(this).data('record');
        if (registro && registro.CPFBeneficiario === cpf) {
            existe = true;
            return false; // interrompe o loop
        }
    });

    return existe;
}

function criarSequencial(inicio = 1) {
    let contador = inicio;
    return function () {
        return contador++;
    };
}
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove tudo que não é número

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += cpf[i] * (10 - i);
    }

    let digito1 = (soma * 10) % 11;
    if (digito1 === 10) digito1 = 0;
    if (digito1 != cpf[9]) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += cpf[i] * (11 - i);
    }

    let digito2 = (soma * 10) % 11;
    if (digito2 === 10) digito2 = 0;
    if (digito2 != cpf[10]) return false;

    return true;
}
