import React, { Component } from 'react';
import { ApiWebUrl } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTimes } from '@fortawesome/free-solid-svg-icons'
import $ from 'jquery/dist/jquery';
import img1 from '../assets/img/votopositivo.png';
import img2 from '../assets/img/resultado.png';
import img3 from '../assets/img/logogithub.png';
import swal from 'sweetalert'; /* importando sweealert */
import { gsap } from "gsap";

export default class Voto extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listaPartidos: [],
            listaReportes: [],
            TotalVotos:[],
            partidoSeleccionodaIdpartido: "", /* idpartido */
            partidoSeleccionadoNombrepartido: "", /* nombre partido */
            partidoSeleccionadoImagen: "",  /* imagen partido */
        }

    }
    componentDidMount() {
        this.obtenerPartidos();
        this.obtenerReportes();
        this.obtenerTotal_Voto();
    }
    obtenerPartidos() {
        const rutaServicio = ApiWebUrl + "partidos.php";
        fetch(rutaServicio, {
            'Cache-Control': 'no-cache, must-revalidate', 'Expires': 0,
            method: 'GET',
        })
            .then(
                res => res.json()
            )
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        listaPartidos: result
                    })
                }
            )
    }
    obtenerReportes() {
        const rutaServicio = ApiWebUrl + "resultados.php";
            fetch(rutaServicio, {
                'Cache-Control': 'no-cache, must-revalidate', 'Expires': 0,
                method: 'GET',
            })
            .then(
                res => res.json()
            )
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        listaReportes: result
                    })
                }
            )
    }
    obtenerTotal_Voto() {
        const rutaServicio = ApiWebUrl + "total_votos.php";
            fetch(rutaServicio, {
                'Cache-Control': 'no-cache, must-revalidate', 'Expires': 0,
                method: 'GET',
            })
            .then(
                res => res.json()
            )
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        TotalVotos: result
                    })
                }
            )
    }
    dibujarPartidos = (datosTablaPartidos) => {
        return (
            <>
                <div className="container-fluid">
                    <div className="row row-cols-1 row-cols-md-4 g-4 border-primary ">
                        {datosTablaPartidos.map(itemPartido =>
                            <div className="col image-container">
                                <div id="imagenes"  className="card" key={itemPartido.idpartido}>
                                      <img  src={ApiWebUrl + 'fotos/' + itemPartido.imagen_partido} className="card-img-top img-thumbnail rounded " alt="..." /> 
                                    <div className="card-body">
                                        <h5 className="card-title text-center">{itemPartido.nombre_partido} </h5>
                                    </div>
                                    <div className="col-md-12 text-center">
                                        <button className="btn btn-success btn-lg" onClick={() => this.mostrarVoto(itemPartido)}> Votar </button>
                                    </div>
                                    <br></br>
                                </div>
                                <br></br>
                            </div>
                        )}
                    </div>
                </div>
            </>
        )
    }
    /* Pasando los parametros para Aceptar el voto */
    mostrarVoto(itemPartido) {
        this.setState({
            partidoSeleccionodaIdpartido: itemPartido.idpartido,
            partidoSeleccionadoNombrepartido: itemPartido.nombre_partido,
            partidoSeleccionadoImagen: itemPartido.imagen_partido,
        })
        $("#modalConfirmarvoto").modal();
    }
    mostrarResultado() {
        $("#modalReporte").modal();
    }
    registrarVoto = (e) => {
        const rutaServicio = ApiWebUrl + "insertar_voto.php";
        var formData = new FormData();
        formData.append("idpartido", this.state.partidoSeleccionodaIdpartido)
        //Asi se agregan todos los parámetros que el servicio requiera (nombre del parámetro , valor que se envía)  
        fetch(rutaServicio, {
            method: 'POST',
            body: formData
        })
            .then(
                () => {
                    this.obtenerPartidos();
                    this.obtenerReportes();
                    this.obtenerTotal_Voto();
                    $("#modalConfirmarvoto").modal("toggle");
                    swal(
                        {
                            text: " Se registro sastifactoriamente su voto.",
                            icon: "success",
                            button: "Ok",
                            timer: "3000",
                        });
                }
            )
    }
    dibujarModalConfirmarVoto() {
        return (
            <div className="modal fade" id="modalConfirmarvoto" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-warning">
                            <div className="container text-center">
                                <h5 className="modal-title" id="exampleModalLabel">Confirmación Voto</h5>
                            </div>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form>
                            <div className="modal-body">
                                <div className="container text-center">
                                    <div className="form-group centered">
                                        <input type="hidden" className="form-control" value={this.state.partidoSeleccionodaIdpartido} disabled />
                                    </div>
                                    <div className="form-group">
                                        <h6> "{this.state.partidoSeleccionadoNombrepartido}"</h6>
                                    </div>
                                    <img src={ApiWebUrl + 'fotos/' + this.state.partidoSeleccionadoImagen} className="contorno img-thumbnail rounded" alt="..." />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-dismiss="modal">Cerrar</button>
                                <button type="button" className="btn btn-primary" onClick={() => this.registrarVoto()}>Aceptar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

    dibujarModalReportes(datosTablaReportes,datoTotalVoto) {
        return (
            <div className="modal fade" id="modalReporte">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Resultados</h4>
                            <button type="button" className="close" data-dismiss="modal">X</button>
                        </div>
                        <div className="modal-body">
                            <div className="container-fluid">
                                <div className="row row-cols-1 row-cols-md-4 g-4 border-primary ">
                                    {datosTablaReportes.map(itemReporte =>
                                        <div className="col image-container">
                                            <div className="card" key={itemReporte.idpartido}>
                                            <br></br>
                                                <h6 className="card-title text-center">{itemReporte.nombre_partido} </h6>
                                                <img src={ApiWebUrl + 'fotos/' + itemReporte.imagen_partido} className="card-img-top img-thumbnail rounded" alt="..." />
                                                <div className="card-body">
                                                    <h5 className="card-title text-center" style={{fontSize:12}}>" {itemReporte.lema_partido} " </h5>
                                                </div>
                                                <div className="col-md-12 text-center">
                                                    <span className="badge badge-info">Votos : {itemReporte.contador}</span>
                                                </div>
                                                <br></br>
                                            </div>
                                            <br></br>
                                        </div>          
                                    )}       
                                </div>
                                {datoTotalVoto.map(itemVoto =>
                                    <div className="container text-center tamano" key={itemVoto.total_votos}>
                                        <span className="badge badge-success">Total Votos :{itemVoto.total_votos}</span>
                                    </div>
                                )} 
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    /* Animation  */
    textoanimation(){
        $('.name_animation').each(function(i) {
            var letter = $(this);
            setTimeout(function() {
                letter.removeClass('transparent');
        
            }, 100 * i);
        });
    } 
    /* logo y las imagenes */
    logoanimation(){
        let tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
        tl.to('#titulo', {
                duration: 2,
                x: 100,
                ease: 'linear'
       });
       let tl2 = gsap.timeline({ repeat: -1, repeatDelay: 1 });   
       tl2.to('#logo', {
       duration: 2,
       rotate: 350
       });
       tl2.to('#logo-github', {
           duration: 2,
           rotate: 360
       });
       tl2.to('#imagenes', {
        duration: 3,
        x:0,
        backgroundColor: '#FFF176',
        borderRadius: '5%',
        border: '5px solid black',
        ease: 'bounce'
      }, '+=1');

    } 
    /* Fin Animation */
    render() {
        let contenidoPartidos = this.dibujarPartidos(this.state.listaPartidos);
        let contenidoModal = this.dibujarModalConfirmarVoto();
        let contenidoModalReporte = this.dibujarModalReportes(this.state.listaReportes,this.state.TotalVotos);
        let mostrarlogoAnimation=this.logoanimation();
        let TextoAnimation=this.textoanimation();
        return (
            <>
                <nav id="nav-color" className="navbar navbar-light bg-light">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">
                            <img id="logo" src={img1} alt="" width="30" height="24" className="d-inline-block align-top margen logo" />
                            <label id="titulo"> TU VOTO . APP </label> 
                        </a>
                        <button type="button" className="btn btn-info" data-toggle="modal" data-target="#modalReporte">
                            Ver Resultados  <img src={img2} />
                        </button>

                    </div>
                </nav>
                <section id="tabla-categorias" className="padded">        
                    <div className="container">
                        <br></br>  
                        <div className="row">
                            <div className="col-md-12">
                                {contenidoPartidos}        
                            </div>
                        </div>
                    </div>
                    {contenidoModal}
                    {contenidoModalReporte}
                </section>
                <footer id="footer">
                    <div className="container" style={{padding:"50px"}}>
                        <h6 className="text-center"> 2021 - Todos los derechos reservados </h6>
                        <div className="col text-center">
                            <h4 id="name" className="text-center" >
                                <span> P</span><span className="name_animation transparent">e</span><span className="name_animation transparent">d</span><span className="name_animation transparent">r</span><span className="name_animation transparent">o</span> 
                                <span> M</span><span className="name_animation transparent">a</span><span className="name_animation transparent">n</span><span className="name_animation transparent">u</span><span className="name_animation transparent">e</span><span className="name_animation transparent">l</span>
                                <span> A</span><span className="name_animation transparent">n</span><span className="name_animation transparent">t</span><span className="name_animation transparent">o</span><span className="name_animation transparent">n</span><span className="name_animation transparent">i</span><span className="name_animation transparent">o</span>
                                <span> J</span><span className="name_animation transparent">u</span><span className="name_animation transparent">r</span><span className="name_animation transparent">a</span><span className="name_animation transparent">d</span><span className="name_animation transparent">o</span>
                                <span> M</span><span className="name_animation transparent">o</span><span className="name_animation transparent">r</span><span className="name_animation transparent">e</span><span className="name_animation transparent">n</span><span className="name_animation transparent">o </span>
                                <a href="https://github.com/PedroManuelJM" target="_blank"><img id="logo-github" src={img3} /></a>
                            </h4>    
                        </div>
                    </div>
                </footer>
                {mostrarlogoAnimation}
                {TextoAnimation}
            </>
        );
    }
}